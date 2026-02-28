from fastapi import FastAPI, HTTPException, UploadFile, File, Header, Request as FastAPIRequest, Query, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from supabase_client import supabase
from models import PlagiarismResult, PlagiarismRequest, HumanizeRequest, HumanizeResult
import uvicorn
import os
import json
from datetime import datetime, timedelta
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse, RedirectResponse
import io
from PyPDF2 import PdfReader
from docx import Document
from config import config
from models import (
    UserCreate, UserLogin, PlagiarismRequest, PlagiarismResult, HumanizeRequest,
    HumanizeResult, ChatRequest, ChatResponse, Token, PasswordReset,
    SubscriptionRequest, RefundRequestModel, DownloadHumanizedRequest, APIResponse,
    RiskPredictionRequest, RiskPredictionResult, LogActivityRequest, UserSettingsModel
)
from ai_model import (
    analyze_with_groq_api, humanize_with_groq_api, chat_with_groq_api,
    calculate_plagiarism_score, detect_ai_content, find_potential_sources,
    apply_humanization_rules, calculate_improvement_score, get_local_chat_response_fallback,
    moderate_message, generate_humanized_doc, extract_text_from_bytes, execute_advanced_plagiarism_check
)
from supabase_client import supabase
from pydantic import BaseModel

class FileCheckRequest(BaseModel):
    document_id: str

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    organization: Optional[str] = None



def get_user_safely(token: str):
    try:
        return supabase.auth.get_user(token)
    except Exception as e:
        print(f'Auth Error: {e}')
        return None

app = FastAPI(
    title=config.APP_TITLE,
    description=config.APP_DESCRIPTION,
    version=config.APP_VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get_cors_settings()["allow_origins"],
    allow_credentials=config.get_cors_settings()["allow_credentials"],
    allow_methods=config.get_cors_settings()["allow_methods"],
    allow_headers=config.get_cors_settings()["allow_headers"],
)

# print("Loaded GROQ API Key:", os.getenv("GROQ_API_KEY")) # Commented out for security
# Trigger reload to ensure fpdf/docx libraries are loaded




# --- Optional Libraries for Document Generation (for user activity downloads) ---
try:
    from docx import Document
except ImportError:
    Document = None
    print("WARNING: python-docx library not found. Word document generation will be disabled.")
try:
    from fpdf import FPDF
except ImportError:
    FPDF = None
    print("WARNING: fpdf library not found. PDF generation will be disabled.")



# --- Static File Serving ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR_ABS = os.path.join(BASE_DIR, config.FRONTEND_DIR_REL)

if not os.path.exists(FRONTEND_DIR_ABS):
    print(f"WARNING: Frontend directory not found at {FRONTEND_DIR_ABS}. Static files will not be served correctly.")
else:
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR_ABS), name="static")

@app.get("/")
async def serve_index():
    index_path = os.path.join(FRONTEND_DIR_ABS, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="index.html not found.")

# --- Health Check Endpoint ---
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# --- Authentication Endpoints ---
@app.post("/api/auth/register")
async def register_user(user_data: UserCreate):
    try:
        # Create user inside Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email, 
            "password": user_data.password
        })
        
        if not auth_response.user:
            raise ValueError("Failed to create user in Supabase")

        new_user_id = auth_response.user.id
        
        # Insert matching public.profiles record
        profile_data = {
            "id": new_user_id,
            "full_name": user_data.fullName,
            "email": user_data.email,
            "plan": "free",
            "role": "user",
            "is_verified": False # Managed by Supabase internally, but mapped here as backup
        }
        supabase.table("profiles").insert(profile_data).execute()
        
        return {
            "message": "User registered successfully", 
            "user": profile_data, 
            "email_sent": True # Supabase automatically sends verification email OTPs
        }

    except Exception as e:
        print(f"Auth Error: {e}")
        # Capture Supabase specific errors if applicable
        error_msg = str(e)
        if "already registered" in error_msg.lower():
            raise HTTPException(status_code=400, detail="User already exists")
        raise HTTPException(status_code=400, detail=error_msg)

@app.post("/api/auth/login")
async def login_user(user_data: UserLogin):
    try:
        # Check Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        
        session = auth_response.session
        user = auth_response.user
        
        if session and user:
            # Fetch complete profile to match Authentic models
            profile_response = supabase.table("profiles").select("*").eq("id", user.id).execute()
            profile = profile_response.data[0] if profile_response.data else {}
            
            combined_user = {
                "id": user.id,
                "email": user.email,
                **profile
            }
            
            return {
                "access_token": session.access_token,
                "token_type": "bearer",
                "user": combined_user
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
             
    except Exception as e:
        print(f"Login Error: {e}")
        error_msg = str(e)
        if "Email not confirmed" in error_msg:
            raise HTTPException(status_code=403, detail="Please verify your email before logging in")
        raise HTTPException(status_code=401, detail="Invalid credentials or server error")

@app.get("/api/auth/verify-email")
async def verify_email_endpoint(token: str):
    # Handled via frontend Supabase callback now automatically.
    return {"message": "Supabase handles this automatically on frontend"}

@app.get("/api/auth/google/login")
async def google_login():
    # Helper to simulate google login or disable it since we removed Supabase
    # For now, we return a mock or error, as Google Auth usually requires a provider
    # User asked to "Remove superbus integration", and Google Auth was done via Supabase.
    # We will return 404 or a message saying it's disabled for local mode.
    raise HTTPException(status_code=501, detail="Google Login not available in local storage mode")

@app.get("/api/user/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        # Get user from Supabase Auth
        auth_response = get_user_safely(token)
        if not auth_response or not auth_response.user:
            raise HTTPException(status_code=401, detail="Invalid session")
            
        user = auth_response.user
        
        # Hydrate user data from public.profiles
        profile_response = supabase.table("profiles").select("*").eq("id", user.id).execute()
        profile = profile_response.data[0] if profile_response.data else {}
        
        return {
            "id": user.id,
            "email": user.email,
            **profile
        }
    except Exception as e:
        print(f"User Fetch Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired session token")

@app.post("/api/subscribe")
async def subscribe_user(request: SubscriptionRequest, authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        # Extract user from token
        token = authorization.split(" ")[1] if " " in authorization else authorization
        auth_response = get_user_safely(token)
        if not auth_response or not auth_response.user:
            raise HTTPException(status_code=401, detail="Invalid session")
            
        user = auth_response.user
        
        # Log Transaction
        transaction_data = {
            "user_id": user.id,
            "plan_id": request.plan_id,
            "billing_cycle": request.billing_cycle,
            "amount": request.amount,
            "payment_method": request.payment_method,
            "order_id": request.order_id,
        }
        
        supabase.table("transactions").insert(transaction_data).execute()
        
        # Update user profile subscription plan
        supabase.table("profiles").update({"plan": request.plan_id}).eq("id", user.id).execute()
        
        return {"status": "success", "message": "Subscription activated", "plan": request.plan_id}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Subscription Error: {e}")
        return {"status": "error", "message": str(e)}

@app.post("/api/request-refund")
async def request_refund(request: RefundRequestModel, authorization: Optional[str] = Header(None)):
    try:
        user_id = None
        if authorization:
            token = authorization.replace("Bearer ", "")
            auth_response = get_user_safely(token)
            if auth_response and auth_response.user:
                user_id = auth_response.user.id

        refund_data = {
            "transaction_id": request.order_id,
            "reason": f"{request.reason}: {request.description}",
            "status": "pending"
        }
        if user_id:
            refund_data["user_id"] = user_id
            
        supabase.table("refunds").insert(refund_data).execute()
        return {"status": "success", "message": "Refund request received and logged in database"}
    except Exception as e:
        print(f"Refund Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process refund request")

# --- Helper Hooks for Advanced Pipeline ---
PLAN_LIMITS = {
    "free": {"plagiarism": 999999, "humanizer": 999999, "bulk": 999},
    "student_pro": {"plagiarism": 300000, "humanizer": 50000, "bulk": 0},
    "student_plus": {"plagiarism": 800000, "humanizer": 200000, "bulk": 10},
    "professional": {"plagiarism": 2000000, "humanizer": 1000000, "bulk": 99999},
    "enterprise": {"plagiarism": 99999999, "humanizer": 99999999, "bulk": 99999}
}

def check_user_limits(user, action: str, check_cost: int = 1) -> dict:
    if not user:
        return {"plan": "anonymous", "limit": 0, "used_words": 0, "remaining_words": 0}
        
    user_id = user.id
    profile_response = supabase.table("profiles").select("plan").eq("id", user_id).execute()
    plan = profile_response.data[0].get("plan", "free") if profile_response.data else "free"
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])
    
    now = datetime.now()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()
    
    if action == "plagiarism":
        limit = limits.get("plagiarism", 5000)
        usage_res = supabase.table("checks").select("words_count").eq("user_id", user_id).gte("created_at", start_of_month).execute()
        used = sum(item.get("words_count") or 0 for item in usage_res.data) if usage_res.data else 0
        
        if used + check_cost > limit:
            raise HTTPException(status_code=402, detail=f"Monthly plagiarism word limit reached for {plan.upper()} plan. Upgrade required.")
        return {"plan": plan, "limit": limit, "used_words": used, "remaining_words": limit - used}
        
    elif action == "humanize":
        limit = limits.get("humanizer", 0)
        if limit == 0:
            raise HTTPException(status_code=403, detail=f"AI Humanizer is not available on your {plan.upper()} plan.")
            
        usage_res = supabase.table("humanize_requests").select("input_text").eq("user_id", user_id).gte("created_at", start_of_month).execute()
        used = sum(len((item.get("input_text") or "").split()) for item in usage_res.data) if usage_res.data else 0
        
        if used + check_cost > limit:
            raise HTTPException(status_code=402, detail=f"Monthly humanizer word limit reached for {plan.upper()} plan. Upgrade required.")
        return {"plan": plan, "limit": limit, "used_words": used, "remaining_words": limit - used}
        
    return {"plan": plan, "limit": 0, "used_words": 0, "remaining_words": 0}

def log_audit_async(user_id: str, text_length: int, text_hash: str, api_used: bool, result_summary: str):
    # Log securely to a file in a non-blocking background task (Step 8)
    try:
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "text_length": text_length,
            "hash": text_hash,
            "api_used": api_used,
            "result_summary": result_summary
        }
        with open("plagiarism_audit.log", "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        print(f"Failed to write audit log: {e}")

# --- Core API Endpoints (calling ai_model functions) ---
@app.post("/api/check-plagiarism", response_model=APIResponse[PlagiarismResult])
async def check_plagiarism_endpoint(
    request_data: PlagiarismRequest, 
    fastapi_request: FastAPIRequest,
    background_tasks: BackgroundTasks
):
    try:
        user = None
        auth_header = fastapi_request.headers.get("Authorization")
        if auth_header:
            token = auth_header.replace("Bearer ", "")
            auth_response = get_user_safely(token)
            if auth_response and auth_response.user:
                user = auth_response.user
            
        word_count = len(request_data.text.split())
        
        usage_meta = {"plan": "anonymous", "limit": 0, "used_words": 0, "remaining_words": 0}
        # Step 7: Usage limit hook
        if user:
            usage_meta = check_user_limits(user, "plagiarism", check_cost=word_count)
            
        start_time = datetime.now()
        
        # Step 4, 5, 6: Switch to advanced pipeline
        adv_plag_result = await execute_advanced_plagiarism_check(
            text=request_data.text,
            language=request_data.language or "en",
            content_type=request_data.category or "other"
        )
        
        # Keep AI detection as is for backwards compatibility
        ai_detection_result = await analyze_with_groq_api(request_data.text, "ai_detection") if request_data.check_ai_content else {"is_ai": False, "confidence": 0.0}
        
        processing_time = (datetime.now() - start_time).total_seconds()
        plagiarism_score = adv_plag_result.get("score", 0.0)
        
        result_obj = PlagiarismResult(
            plagiarism_score=plagiarism_score,
            is_ai_generated=ai_detection_result.get("is_ai", False),
            ai_confidence=ai_detection_result.get("confidence", 0.0),
            sources_found=adv_plag_result.get("sources", []),
            word_count=word_count,
            analysis_time=processing_time,
            unique_content_percentage=100 - plagiarism_score,
            ai_flagged_segments=ai_detection_result.get("ai_sentences", []),
            
            # Step 6: Advanced schema fields
            originality_level=adv_plag_result.get("originality_level"),
            similarity_range=adv_plag_result.get("similarity_range"),
            confidence=adv_plag_result.get("confidence"),
            analysis_summary=adv_plag_result.get("analysis_summary"),
            matched_patterns=adv_plag_result.get("matched_patterns", []),
            api_used=adv_plag_result.get("api_used", False)
        )
        
        # Step 8: Logging & Audit (Non-blocking)
        import hashlib
        text_hash = hashlib.sha256(request_data.text.encode('utf-8')).hexdigest()
        user_id = user.email if user else "anonymous"
        background_tasks.add_task(
            log_audit_async, 
            user_id, word_count, text_hash, 
            adv_plag_result.get("api_used", False), 
            adv_plag_result.get("analysis_summary", "")
        )

        # Remote DB Activity Log
        if user:
            try:
                # Insert document record first for advanced view hooks
                doc_data = {
                    "user_id": user.id,
                    "title": request_data.title or "Untitled Document",
                    "original_text": request_data.text,
                    "language": request_data.language or "en"
                }
                doc_ins = supabase.table("documents").insert(doc_data).execute()
                doc_id = doc_ins.data[0]['id'] if doc_ins.data else None
            except Exception as e:
                print(f"Error inserting document: {e}")
                doc_id = None
                
            check_data = {
                "user_id": user.id,
                "document_id": doc_id,
                "similarity": plagiarism_score,
                "words_count": word_count,
                "status": "completed"
            }
            try:
                ins = supabase.table("checks").insert(check_data).execute()
                import uuid
                result_obj.id = str(ins.data[0]['id']) if ins.data else str(uuid.uuid4())
            except Exception as e:
                print(f"Error inserting check: {e}")
                import uuid
                result_obj.id = str(uuid.uuid4())

        return APIResponse(
            success=True,
            plan=usage_meta.get("plan", "anonymous"),
            used_words=usage_meta.get("used_words", 0),
            remaining_words=usage_meta.get("remaining_words", 0),
            limit=usage_meta.get("limit", 0),
            data=result_obj
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL ERROR in check_plagiarism_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/check-file-plagiarism", response_model=APIResponse[PlagiarismResult])
async def check_file_plagiarism_endpoint(
    fastapi_request: FastAPIRequest,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: Optional[str] = Form("en"),
    category: Optional[str] = Form("other")
):
    try:
        user = None
        auth_header = fastapi_request.headers.get("Authorization")
        if auth_header:
            token = auth_header.replace("Bearer ", "")
            auth_response = get_user_safely(token)
            if auth_response and auth_response.user:
                user = auth_response.user
            
        content = await file.read()
        extracted_text = await extract_text_from_bytes(content, file.content_type)

        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file.")
             
        word_count = len(extracted_text.split())

        # Step 7: Usage limit hook
        usage_meta = {"plan": "anonymous", "limit": 0, "used_words": 0, "remaining_words": 0}
        if user:
            usage_meta = check_user_limits(user, "plagiarism", check_cost=word_count)

        start_time = datetime.now()
        
        # Step 4, 5, 6: Switch to advanced pipeline
        adv_plag_result = await execute_advanced_plagiarism_check(
            text=extracted_text, 
            language=language or "en",
            content_type=category or "other"
        )
        
        ai_detection_result = await analyze_with_groq_api(extracted_text, "ai_detection")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        plagiarism_score = adv_plag_result.get("score", 0.0)
        
        result_obj = PlagiarismResult(
            plagiarism_score=plagiarism_score,
            is_ai_generated=ai_detection_result.get("is_ai", False),
            ai_confidence=ai_detection_result.get("confidence", 0.0),
            sources_found=adv_plag_result.get("sources", []),
            word_count=word_count,
            analysis_time=processing_time,
            unique_content_percentage=100 - plagiarism_score,
            ai_flagged_segments=ai_detection_result.get("ai_sentences", []),
            
            # Step 6: Advanced schema fields
            originality_level=adv_plag_result.get("originality_level"),
            similarity_range=adv_plag_result.get("similarity_range"),
            confidence=adv_plag_result.get("confidence"),
            analysis_summary=adv_plag_result.get("analysis_summary"),
            matched_patterns=adv_plag_result.get("matched_patterns", []),
            api_used=adv_plag_result.get("api_used", False)
        )
        
        # Step 8: Logging & Audit (Non-blocking)
        import hashlib
        text_hash = hashlib.sha256(extracted_text.encode('utf-8')).hexdigest()
        user_id = user.email if user else "anonymous"
        background_tasks.add_task(
            log_audit_async, 
            user_id, word_count, text_hash, 
            adv_plag_result.get("api_used", False), 
            adv_plag_result.get("analysis_summary", "")
        )
        
        # Remote DB Activity Log
        if user:
            try:
                # Insert document record implicitly for advanced view hooks
                doc_data = {
                    "user_id": user.id,
                    "title": file.filename or "File Upload",
                    "original_text": extracted_text,
                    "language": language or "en"
                }
                doc_ins = supabase.table("documents").insert(doc_data).execute()
                doc_id = doc_ins.data[0]['id'] if doc_ins.data else None
            except Exception as e:
                print(f"Error inserting document: {e}")
                doc_id = None
                
            check_data = {
                "user_id": user.id,
                "document_id": doc_id,
                "similarity": plagiarism_score,
                "words_count": word_count,
                "status": "completed"
            }
            try:
                ins = supabase.table("checks").insert(check_data).execute()
                import uuid
                result_obj.id = str(ins.data[0]['id']) if ins.data else str(uuid.uuid4())
            except Exception as e:
                print(f"Error inserting check: {e}")
                import uuid
                result_obj.id = str(uuid.uuid4())

        return APIResponse(
            success=True,
            plan=usage_meta.get("plan", "anonymous"),
            used_words=usage_meta.get("used_words", 0),
            remaining_words=usage_meta.get("remaining_words", 0),
            limit=usage_meta.get("limit", 0),
            data=result_obj
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL ERROR in check_file_plagiarism_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/reports/{report_id}")
async def get_report(report_id: str, authorization: Optional[str] = Header(None)):
    """
    Fetches a detailed report by ID.
    If authorized, fetches from user history in LocalDB. Defaults to mock for unregistered usage.
    """
    try:
        if report_id != "1":
            res = supabase.table("checks").select("*, documents(title)").eq("id", report_id).execute()
            if res.data:
                check = res.data[0]
                doc_title = check.get("documents", {}).get("title") if check.get("documents") else "Checked Document"
                
                score = float(check.get("similarity", 0))
                status = "high" if score > 50 else ("moderate" if score > 20 else "safe")
                
                sources_res = supabase.table("check_sources").select("*").eq("check_id", report_id).execute()
                sources = sources_res.data if sources_res.data else []
                
                return {
                    "id": check["id"],
                    "title": doc_title,
                    "date": check.get("created_at", "").split("T")[0],
                    "similarity": round(score),
                    "status": status,
                    "words": check.get("words_count", 0),
                    "integrityScore": {
                        "overall": 100 - round(score),
                        "originality": 100 - round(score),
                        "vocabularyDiversity": 90,
                        "rewritingScore": 85,
                        "aiDetectionProbability": 15,
                    },
                    "sources": sources,
                    "sentences": []
                }
        
        # Fallback for demo/mock IDs
        if True: 
            if report_id == "1":
                return {
                    "id": "1",
                    "title": "Research Paper - Climate Change",
                    "date": "December 5, 2024",
                    "similarity": 15,
                    "status": "safe",
                    "words": 2847,
                    "integrityScore": {
                        "overall": 87,
                        "originality": 85,
                        "vocabularyDiversity": 92,
                        "rewritingScore": 88,
                        "aiDetectionProbability": 18,
                    },
                    "sources": [
                        {"id": 1, "url": "https://example.com/climate", "title": "Climate Change Study 2024", "similarity": 8, "category": "academic"},
                         {"id": 2, "url": "https://example.com/env", "title": "Environmental Impact", "similarity": 4, "category": "journal"}
                    ],
                    "sentences": [] # Mock sentences would go here
                }
            raise HTTPException(status_code=404, detail="Report not found")

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/profile")
async def update_profile(
    updates: ProfileUpdate, 
    authorization: Optional[str] = Header(None)
):
    try:
        user = verify_token(authorization)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
        
    update_dict = updates.model_dump(exclude_unset=True)
    if not update_dict:
        return {"user": user}
        
    res = supabase.table("profiles").update(update_dict).eq("id", user["id"]).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"user": res.data[0]}

@app.post("/api/profile/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None)
):
    try:
        user = verify_token(authorization)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
        
    import base64
    content = await file.read()
    
    # Simple direct base64 embedding for MVP
    mime_type = file.content_type or "image/jpeg"
    encoded_string = base64.b64encode(content).decode("utf-8")
    data_uri = f"data:{mime_type};base64,{encoded_string}"
    
    res = supabase.table("profiles").update({"avatar_url": data_uri}).eq("id", user["id"]).execute()
    updated_user = res.data[0] if res.data else user
    
    return {"user": updated_user, "avatar_url": data_uri}

@app.get("/api/settings")
async def get_user_settings(authorization: Optional[str] = Header(None)):
    try:
        user = verify_token(authorization)
        res = supabase.table("user_settings").select("*").eq("user_id", user["id"]).execute()
        if res.data:
            return res.data[0]
        else:
            # Create default settings if not exists
            default_settings = {"user_id": user["id"]}
            ins = supabase.table("user_settings").insert(default_settings).execute()
            return ins.data[0] if ins.data else default_settings
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post("/api/settings")
async def update_user_settings(settings: UserSettingsModel, authorization: Optional[str] = Header(None)):
    try:
        user = verify_token(authorization)
        update_dict = settings.model_dump(exclude_unset=True)
        res = supabase.table("user_settings").update(update_dict).eq("user_id", user["id"]).execute()
        if not res.data:
            # Insert if missing
            update_dict["user_id"] = user["id"]
            res = supabase.table("user_settings").insert(update_dict).execute()
        return res.data[0] if res.data else update_dict
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.delete("/api/reports/{report_id}")
async def delete_report(report_id: str, authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.replace("Bearer ", "")
    auth_response = get_user_safely(token)
    if not auth_response or not auth_response.user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user = auth_response.user
    
    # Delete from checks table
    res = supabase.table("checks").delete().eq("user_id", user.id).eq("id", report_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Report not found or could not be deleted")
        
    return {"status": "success", "message": "Report deleted"}

@app.get("/api/history")
async def get_user_history(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.replace("Bearer ", "")
    auth_response = get_user_safely(token)
    if not auth_response or not auth_response.user:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user = auth_response.user
    
    # Retrieve their activity logs filtered by plagiarism checks
    res = supabase.table("checks").select("*, documents(title)").eq("user_id", user.id).execute()
    logs = res.data if res.data else []
    
    reports = []
    for log in logs:
        doc_title = log.get("documents", {}).get("title") if log.get("documents") else "Checked Document"
        
        score = float(log.get("similarity", 0))
        if score > 50:
            status = "high"
        elif score > 20:
            status = "moderate"
        else:
            status = "safe"

        reports.append({
            "id": log["id"],
            "title": doc_title,
            "date": log.get("created_at", "").split("T")[0],
            "similarity": round(score),
            "status": status,
            "words": log.get("words_count", 0)
        })

    # Sort newest first
    reports.sort(key=lambda x: x["date"], reverse=True)
    return reports

@app.post("/api/humanizer", response_model=APIResponse[HumanizeResult])
async def humanize_text_endpoint(request_data: HumanizeRequest, fastapi_request: FastAPIRequest):
    try:
        user = None
        auth_header = fastapi_request.headers.get("Authorization")
        if auth_header:
            token = auth_header.replace("Bearer ", "")
            auth_response = get_user_safely(token)
            if auth_response and auth_response.user:
                user = auth_response.user

        doc_word_count = len(request_data.text.split())
        usage_meta = {"plan": "anonymous", "limit": 0, "used_words": 0, "remaining_words": 0}
        
        if user:
            usage_meta = check_user_limits(user, "humanize", check_cost=doc_word_count)

        start_time = datetime.now()
        humanize_result = await humanize_with_groq_api(
            request_data.text, 
            request_data.writing_style, 
            request_data.complexity_level, 
            request_data.target_language,
            request_data.content_type
        )
        improvement_data = calculate_improvement_score(request_data.text, humanize_result.get("humanized_text", ""))
        word_count = len(humanize_result.get("humanized_text", "").split())
        processing_time = (datetime.now() - start_time).total_seconds()
        
        result_obj = HumanizeResult(
            original_text=request_data.text,
            humanized_text=humanize_result.get("humanized_text", ""),
            improvement_score=improvement_data["improvement"],
            changes_made=humanize_result.get("changes", []),
            word_count=word_count,
            processing_time=processing_time,
            original_ai_score=improvement_data["original_score"],
            humanized_ai_score=improvement_data["humanized_score"]
        )

        # ===== Supabase Save: Humanizer =====
        if user:
            try:
                hum_data = {
                    "user_id": user.id,
                    "level": request_data.complexity_level,
                    "input_text": request_data.text,
                    "output_text": humanize_result.get("humanized_text", "")
                }
                supabase.table("humanize_requests").insert(hum_data).execute()
            except Exception as err:
                print("SUPABASE ERROR (HUMANIZER): ", err)
        # ===== END Supabase Humanizer Save =====

        return APIResponse(
            success=True,
            plan=usage_meta.get("plan", "anonymous"),
            used_words=usage_meta.get("used_words", 0),
            remaining_words=usage_meta.get("remaining_words", 0),
            limit=usage_meta.get("limit", 0),
            data=result_obj
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL ERROR in humanize_text_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/ai-chat", response_model=ChatResponse)
async def ai_chat_endpoint(request_data: ChatRequest):
    user_message = request_data.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    moderation_result = moderate_message(user_message)
    if moderation_result["flagged"]:
        return ChatResponse(reply=moderation_result["reason"])
    chat_reply = await chat_with_groq_api(user_message)
    return ChatResponse(reply=chat_reply)



# ------------------------------------------------------------------
# Helper Functions
# ------------------------------------------------------------------

def is_valid_text(text: str, min_words: int = 20) -> bool:
    words = text.split()
    return len(words) >= min_words

def verify_token(authorization: Optional[str]) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    token = authorization.replace("Bearer ", "")
    auth_response = get_user_safely(token)
    if not auth_response or not auth_response.user:
        raise HTTPException(status_code=401, detail="Invalid session")
        
    user = auth_response.user
    profile_response = supabase.table("profiles").select("*").eq("id", user.id).execute()
    profile = profile_response.data[0] if profile_response.data else {}
    
    return {
        "id": user.id,
        "email": user.email,
        **profile
    }

# ------------------------------------------------------------------
# Authentication Endpoints (LocalDB)
# ------------------------------------------------------------------

@app.post("/api/predict-risk", response_model=RiskPredictionResult)
async def predict_risk_endpoint(request_data: RiskPredictionRequest):
    """
    Analyzes text complexity and vocabulary to predict risk level.
    """
    try:
        # Simple heuristic analysis (can be enhanced with AI)
        text = request_data.text
        words = text.split()
        word_count = len(words)
        
        # Calculate vocabulary diversity
        unique_words = len(set(w.lower() for w in words))
        vocabulary_score = int((unique_words / word_count) * 100) if word_count > 0 else 0
        vocabulary_score = min(max(vocabulary_score + 20, 0), 100) # Normalize
        
        # Calculate structure score (avg sentence length)
        sentences = text.split('.')
        avg_sentence_len = word_count / len(sentences) if sentences else 0
        structure_score = int(min(avg_sentence_len * 3, 100))
        
        overall_risk_score = int((vocabulary_score + structure_score) / 2)
        
        risk_level = "low"
        if overall_risk_score < 40:
            risk_level = "high"
        elif overall_risk_score < 70:
            risk_level = "medium"

        return RiskPredictionResult(
            vocabulary_score=vocabulary_score,
            structure_score=structure_score,
            risk_level=risk_level,
            overall_risk=100 - overall_risk_score # Risk is inverse of quality/complexity
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-file")
async def upload_file_endpoint(file: UploadFile = File(...)):
    """
    Handles file uploads and extracts text content.
    """
    try:
        allowed_types = ["text/plain", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF, DOCX, or TXT files. (Legacy .doc files are not supported)")
        
        content = await file.read()
        extracted_text = ""

        if file.content_type == "text/plain":
            extracted_text = content.decode('utf-8', errors='ignore')
        elif file.content_type == "application/pdf":
            try:
                with io.BytesIO(content) as pdf_file:
                    reader = PdfReader(pdf_file)
                    for page in reader.pages:
                        text = page.extract_text()
                        if text:
                            extracted_text += text + "\n"
            except Exception as pdf_err:
                print(f"PDF Extraction Error: {pdf_err}")
                raise HTTPException(status_code=400, detail="Failed to extract text from PDF. The file might be corrupted or password protected.")
        elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            try:
                with io.BytesIO(content) as docx_file:
                    doc = Document(docx_file)
                    for para in doc.paragraphs:
                        extracted_text += para.text + "\n"
            except Exception as docx_err:
                print(f"DOCX Extraction Error: {docx_err}")
                raise HTTPException(status_code=400, detail="Failed to extract text from DOCX.")

        return {
            "filename": file.filename,
            "file_type": file.content_type,
            "text_content": extracted_text,
            "word_count": len(extracted_text.split()),
            "character_count": len(extracted_text)
        }
    except Exception as e:
        print(f"ERROR: File upload processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/api/download-humanized-content")
async def download_humanized_content(request_data: DownloadHumanizedRequest, fastapi_request: FastAPIRequest):
    text_content = request_data.text
    download_format = request_data.format
    try:
        # ===== Supabase DB Log Activity =====
        auth_header = fastapi_request.headers.get("Authorization")
        if auth_header:
            token = auth_header.replace("Bearer ", "")
            auth_response = get_user_safely(token)
            if auth_response and auth_response.user:
                user = auth_response.user
                supabase.table("activity_logs").insert({
                    "user_id": user.id,
                    "action": "file_download",
                    "details": json.dumps({
                        "format": download_format,
                        "word_count": len(text_content.split())
                    })
                }).execute()
        # =================================

        # Calls the generate_humanized_doc function from ai_model.py
        file_stream, media_type, filename = generate_humanized_doc(text_content, download_format)
        return StreamingResponse(file_stream, media_type=media_type, headers={"Content-Disposition": f"attachment; filename={filename}"})
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to generate {download_format} document: {e}")
        raise HTTPException(status_code=500, detail=f"Server error generating document: {str(e)}")

@app.post("/api/log")
async def log_generic_activity(request_data: LogActivityRequest, authorization: Optional[str] = Header(None)):
    if not authorization:
        return {"status": "ignored", "reason": "no_auth"} # Don't error, just ignore anon logs if preferred, or track anon?
        # User wants "User Data", so usually requires user. I'll stick to auth required but handle gracefully.
    
    try:
        token = authorization.replace("Bearer ", "")
        auth_response = get_user_safely(token)
        if auth_response and auth_response.user:
            user = auth_response.user
            supabase.table("activity_logs").insert({
                "user_id": user.id,
                "action": request_data.action,
                "details": json.dumps(request_data.details)
            }).execute()
            return {"status": "logged"}
    except Exception as err:
        print(f"Stats Log Error: {err}") # Fail silently for logging
    return {"status": "ignored"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.replace("Bearer ", "")
    auth_response = get_user_safely(token)
    if not auth_response or not auth_response.user:
        raise HTTPException(status_code=401, detail="Invalid session")
        
    user = auth_response.user
    
    # Fetch from dedicated new table for dashboard stats
    db_stats = supabase.table("user_dashboard_stats").select("*").eq("user_id", user.id).execute()
    data = db_stats.data[0] if db_stats.data else None
    
    total_checks = data.get("total_checks", 0) if data else 0
    total_words = data.get("total_words_scanned", 0) if data else 0
    ai_detects = data.get("high_risk_count", 0) if data else 0
    avg_sim = round(data.get("average_similarity", 0), 1) if data else 0

    # Get recent history logs separate
    hist_res = supabase.table("checks").select("*, documents(title)").eq("user_id", user.id).order("created_at", desc=True).limit(50).execute()
    history = hist_res.data if hist_res.data else []

    # Map recent activity for frontend
    mapped_history = []
    for h in history[:10]: # Return top 10 for dashboard
        score = float(h.get("similarity", 0))
        if score > 50:
            status = "high"
        elif score > 20:
            status = "moderate"
        else:
            status = "safe"
            
        doc_title = h.get("documents", {}).get("title") if isinstance(h.get("documents"), dict) else "Checked Document"
        
        mapped_history.append({
            "id": h["id"],
            "title": doc_title,
            "date": h.get("created_at", ""),
            "score": round(score),
            "status": status,
            "type": (h.get("check_type") or "Plagiarism Check").title()
        })

    # Prepare real usage chart aggregated (last 7 days grouped)
    from datetime import datetime, timedelta
    
    chart_data = []
    daily_stats = {}
    for i in range(7):
        d = datetime.now() - timedelta(days=6-i)
        date_str = d.strftime("%Y-%m-%d")
        daily_stats[date_str] = {"name": d.strftime("%a"), "checks": 0, "sum_sim": 0, "count": 0}
        
    for c in history:
        date_str = c.get("created_at", "").split("T")[0]
        if date_str in daily_stats:
            daily_stats[date_str]["checks"] += 1
            daily_stats[date_str]["sum_sim"] += float(c.get("similarity", 0))
            daily_stats[date_str]["count"] += 1
            
    for date_str in sorted(daily_stats.keys()):
        st = daily_stats[date_str]
        avg_sim = round(st["sum_sim"] / st["count"], 1) if st["count"] > 0 else 0
        chart_data.append({
            "name": st["name"],
            "checks": st["checks"],
            "similarity": avg_sim
        })

    stats = {
        "checks_done": total_checks,
        "words_scanned": total_words,
        "ai_content_found": ai_detects,
        "average_similarity": avg_sim,
        "history": mapped_history,
        "usage_chart": chart_data,
        "recent_activity": mapped_history
    }
    return stats


# --- Main entry point for Uvicorn ---
if __name__ == "__main__":
    # Ensure the frontend directory exists for mounting during direct execution
    if not os.path.exists(FRONTEND_DIR_ABS):
        os.makedirs(FRONTEND_DIR_ABS, exist_ok=True)
        print(f"Created frontend directory: {FRONTEND_DIR_ABS}")

    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.RELOAD,
        log_level=config.LOG_LEVEL
    )