import json
import os
import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List

class LocalDB:
    def __init__(self, users_file="local_users.json", activity_file="local_user_activities.json"):
        self.users_file = users_file
        self.activity_file = activity_file
        self._ensure_db_exists()

    def _ensure_db_exists(self):
        if not os.path.exists(self.users_file):
            with open(self.users_file, 'w') as f:
                json.dump({"users": [], "sessions": []}, f, indent=4)
        
        if not os.path.exists(self.activity_file):
            with open(self.activity_file, 'w') as f:
                json.dump({"activities": {}}, f, indent=4)

    def _read_json(self, filepath: str) -> Dict[str, Any]:
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_json(self, filepath: str, data: Dict[str, Any]):
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)

    def _hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()

    # --- User Management (local_users.json) ---

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        users_db = self._read_json(self.users_file)
        if "users" not in users_db: users_db["users"] = []
        
        # Check existing
        for u in users_db["users"]:
            if u["email"] == user_data["email"]:
                raise ValueError("User already exists")

        user_id = str(uuid.uuid4())
        
        # 1. Create Core User Profile
        new_user = {
            "id": user_id,
            "first_name": user_data.get("firstName", ""),
            "last_name": user_data.get("lastName", ""),
            "email": user_data["email"],
            "password_hash": self._hash_password(user_data["password"]),
            "user_type": user_data.get("userType", "student"),
            "created_at": datetime.now().isoformat(),
            "subscription": {
                "plan": "free",
                "status": "active"
            }
        }
        users_db["users"].append(new_user)
        self._save_json(self.users_file, users_db)
        
        # 2. Initialize Activity Record
        self._init_user_activity(user_id)
        
        # Return user without password
        return {k: v for k, v in new_user.items() if k != "password_hash"}

    def _init_user_activity(self, user_id: str):
        activity_db = self._read_json(self.activity_file)
        if "activities" not in activity_db: activity_db["activities"] = {}
        
        activity_db["activities"][user_id] = {
            "history": {
                "plagiarism_checks": [],
                "humanize_requests": [],
                "transactions": [],
                "downloads": [],
                "user_activity": []
            },
            "usage_today": {
                "date": datetime.now().strftime("%Y-%m-%d"),
                "plagiarism_count": 0,
                "humanize_count": 0,
                "bulk_count": 0
            }
        }
        self._save_json(self.activity_file, activity_db)

    def authenticate_user(self, email, password) -> Optional[Dict[str, Any]]:
        users_db = self._read_json(self.users_file)
        users = users_db.get("users", [])
        hashed = self._hash_password(password)
        
        for user in users:
            if user["email"] == email and user.get("password_hash") == hashed:
                token = str(uuid.uuid4())
                
                # Save session
                if "sessions" not in users_db: users_db["sessions"] = []
                users_db["sessions"].append({
                    "token": token,
                    "user_id": user["id"],
                    "email": user["email"],
                    "created_at": datetime.now().isoformat()
                })
                self._save_json(self.users_file, users_db)
                
                # Merge with activity data for frontend
                full_user = self._merge_user_data(user)
                return {"user": full_user, "token": token}
        
        return None

    def get_user_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        users_db = self._read_json(self.users_file)
        sessions = users_db.get("sessions", [])
        users = users_db.get("users", [])
        
        session = next((s for s in sessions if s["token"] == token), None)
        if not session:
            return None
            
        user = next((u for u in users if u["id"] == session["user_id"]), None)
        if not user:
            return None
            
        # Merge with activity data
        return self._merge_user_data(user)

    def _merge_user_data(self, user: Dict[str, Any]) -> Dict[str, Any]:
        """Combines profile from users DB with activity from activity DB"""
        user_copy = {k: v for k, v in user.items() if k != "password_hash"}
        
        activity_db = self._read_json(self.activity_file)
        activities = activity_db.get("activities", {})
        user_activity = activities.get(user["id"])
        
        if user_activity:
            user_copy["history"] = user_activity.get("history", {})
            user_copy["usage_today"] = user_activity.get("usage_today", {})
        else:
            # Fallback if activity record missing
            self._init_user_activity(user["id"])
            user_copy["history"] = {}
            user_copy["usage_today"] = {}
            
        return user_copy

    # --- Activity Logging (local_user_activities.json) ---

    def record_transaction(self, email: str, transaction_data: Dict[str, Any]):
        # Need user_id, resolve from email via users DB
        users_db = self._read_json(self.users_file)
        user = next((u for u in users_db.get("users", []) if u["email"] == email), None)
        if not user: return False
        
        user_id = user["id"]
        
        # Update Activity DB
        activity_db = self._read_json(self.activity_file)
        if "activities" not in activity_db: activity_db["activities"] = {}
        if user_id not in activity_db["activities"]: self._init_user_activity(user_id) # ensure exists
        
        user_record = activity_db["activities"][user_id]
        
        if "transactions" not in user_record["history"]: user_record["history"]["transactions"] = []
        
        if "timestamp" not in transaction_data:
            transaction_data["timestamp"] = datetime.now().isoformat()
        if "id" not in transaction_data:
            transaction_data["id"] = str(uuid.uuid4())
            
        user_record["history"]["transactions"].append(transaction_data)
        self._save_json(self.activity_file, activity_db)
        
        # Update Subscription in Users DB (Profile)
        if "plan_id" in transaction_data:
             days = 365 if transaction_data.get("billing_cycle") == "yearly" else 30
             expiry = (datetime.now() + timedelta(days=days)).isoformat()
             
             # Re-read users db to be safe
             users_db = self._read_json(self.users_file)
             for u in users_db["users"]:
                 if u["id"] == user_id:
                     u["subscription"] = {
                         "plan": transaction_data["plan_id"],
                         "status": "active",
                         "start_date": datetime.now().isoformat(),
                         "expiry_date": expiry,
                         "billing_cycle": transaction_data.get("billing_cycle", "monthly")
                     }
                     break
             self._save_json(self.users_file, users_db)
        
        return True

    def log_activity(self, email: str, activity_type: str, details: Dict[str, Any]):
        # Resolve User ID
        users_db = self._read_json(self.users_file)
        user = next((u for u in users_db.get("users", []) if u["email"] == email), None)
        if not user: return

        user_id = user["id"]
        
        activity_db = self._read_json(self.activity_file)
        if "activities" not in activity_db: activity_db["activities"] = {}
        
        # Ensure record exists (lazy init)
        if user_id not in activity_db["activities"]:
             # Init manual structure here if _init_user_activity relies on reading full file
             activity_db["activities"][user_id] = {
                "history": {"plagiarism_checks": [], "humanize_requests": [], "transactions": [], "downloads": [], "user_activity": []},
                "usage_today": {"date": datetime.now().strftime("%Y-%m-%d"), "plagiarism_count": 0, "humanize_count": 0, "bulk_count": 0}
            }
        
        user_record = activity_db["activities"][user_id]
        
        log_entry = {
            "id": str(uuid.uuid4()),
            "type": activity_type,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        
        if "word_count" in details:
            log_entry["tokens_used"] = details["word_count"]

        # Append to specific lists
        if activity_type == "plagiarism_check":
            user_record["history"]["plagiarism_checks"].append(log_entry)
            self._increment_usage(user_record, "plagiarism_count")
        
        elif activity_type == "humanize_text":
            user_record["history"]["humanize_requests"].append(log_entry)
            self._increment_usage(user_record, "humanize_count")
            
        elif activity_type == "file_download":
            user_record["history"]["downloads"].append(log_entry)
            
        else:
            user_record["history"]["user_activity"].append(log_entry)
            
        self._save_json(self.activity_file, activity_db)

    def get_dashboard_stats(self, email: str) -> Dict[str, Any]:
        users_db = self._read_json(self.users_file)
        user = next((u for u in users_db.get("users", []) if u["email"] == email), None)
        if not user: return {}
        
        # Merge activity
        full_user = self._merge_user_data(user)
        history = full_user.get("history", {})
        
        plagiarism_checks = history.get("plagiarism_checks", [])
        humanize_requests = history.get("humanize_requests", [])
        
        # 1. Totals
        total_checks = len(plagiarism_checks)
        
        # 2. Avg Similarity & Risk
        total_score = 0
        high_risk_count = 0
        for check in plagiarism_checks:
            score = check["details"].get("plagiarism_score", 0)
            total_score += score
            if score > 70: high_risk_count += 1
            
        avg_similarity = round(total_score / total_checks, 1) if total_checks > 0 else 0
        
        # 3. Weekly Usage Chart (Last 7 days)
        usage_data = []
        today = datetime.now()
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_str = day.strftime("%Y-%m-%d")
            
            # Filter checks for this day
            checks_today = [c for c in plagiarism_checks if c["timestamp"].startswith(day_str)]
            count = len(checks_today)
            
            total_score_today = sum(c["details"].get("plagiarism_score", 0) for c in checks_today)
            avg_score_today = round(total_score_today / count, 1) if count > 0 else 0
            
            usage_data.append({
                "name": day.strftime("%a"), # Mon, Tue
                "checks": count,
                "similarity": avg_score_today, # Used by SimilarityChart as 'similarity'
                "date": day_str
            })
            
        # 4. Recent Activity (Merge & Sort)
        # We transform them to a common format
        activity_list = []
        for p in plagiarism_checks:
            activity_list.append({
                "id": p["id"],
                "type": "plagiarism",
                "title": p["details"].get("file_name", p["details"].get("title", "Plagiarism Check")),
                "date": p["timestamp"],
                "score": p["details"].get("plagiarism_score", 0),
                "status": "safe" if p["details"].get("plagiarism_score", 0) < 30 else "moderate" if p["details"].get("plagiarism_score", 0) < 70 else "high"
            })
            
        for h in humanize_requests:
             activity_list.append({
                "id": h["id"],
                "type": "humanizer",
                "title": "Humanized Text", # h["details"].get("title", ...)
                "date": h["timestamp"],
                "score": None, # Humanizer doesn't have similarity
                "status": "safe" # Generally considered safe
            })
            
        # Sort by date desc
        activity_list.sort(key=lambda x: x["date"], reverse=True)
        recent_activity = activity_list[:5]
        
        return {
            "total_checks": total_checks,
            "avg_similarity": avg_similarity,
            "high_risk_count": high_risk_count,
            "remaining_quota": 1000, # Fake quota for now, or calc from sub
            "usage_chart": usage_data,
            "recent_activity": recent_activity,
            "user_name": full_user.get("first_name", "User")
        }

    def _increment_usage(self, user_record: Dict[str, Any], count_key: str):
        today = datetime.now().strftime("%Y-%m-%d")
        usage = user_record.get("usage_today", {})
        
        if usage.get("date") != today:
            usage = {
                "date": today,
                "plagiarism_count": 0,
                "humanize_count": 0,
                "bulk_count": 0
            }
        
        usage[count_key] = usage.get(count_key, 0) + 1
        user_record["usage_today"] = usage

local_db = LocalDB()
