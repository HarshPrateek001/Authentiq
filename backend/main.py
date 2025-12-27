from fastapi import FastAPI, HTTPException, UploadFile, File, Header, Request as FastAPIRequest, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from supabase_client import supabase
from models import PlagiarismResult, PlagiarismRequest, HumanizeRequest, HumanizeResult
import uvicorn
import os
import json
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
import secrets
import io
from PyPDF2 import PdfReader
from docx import Document

from config import config

# Load SECRET_KEY at the very beginning
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    if os.path.exists(config.SECRET_KEY_FILE):
        try:
            with open(config.SECRET_KEY_FILE, "r") as f:
                SECRET_KEY = f.read().strip()
        except Exception:
            pass
    if not SECRET_KEY:
        SECRET_KEY = secrets.token_urlsafe(32)
        with open(config.SECRET_KEY_FILE, "w") as f:
            f.write(SECRET_KEY)

if not SECRET_KEY:
    raise RuntimeError("CRITICAL ERROR: SECRET_KEY could not be loaded or generated.")

from models import (
    PlagiarismRequest, HumanizeRequest, ChatRequest, PlagiarismResult, HumanizeResult, ChatResponse,
    DownloadHumanizedRequest, UserCreate, UserLogin, Token, PasswordReset
)

from ai_model import (
    analyze_with_groq_api, humanize_with_groq_api, chat_with_groq_api,
    calculate_plagiarism_score, detect_ai_content, find_potential_sources,
    apply_humanization_rules, calculate_improvement_score, get_local_chat_response_fallback,
    moderate_message, generate_humanized_doc,
)

from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(
    title=config.APP_TITLE,
    description=config.APP_DESCRIPTION,
    version=config.APP_VERSION
)

app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY,
    https_only=False,  # Set to True in production with HTTPS
    same_site='lax',
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get_cors_settings()["allow_origins"],
    allow_credentials=config.get_cors_settings()["allow_credentials"],
    allow_methods=config.get_cors_settings()["allow_methods"],
    allow_headers=config.get_cors_settings()["allow_headers"],
)

print("Loaded GROQ API Key:", os.getenv("GROQ_API_KEY"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- User Database Management (File-based for Demo) ---
# Global in-memory representation of DBs
USERS_DB: Dict[str, Dict[str, Any]] = {}
USER_ACTIVITY_DB: Dict[str, List[Dict[str, Any]]] = {}
USER_STATS_DB: Dict[str, Dict[str, Any]] = {}

def load_json_db(file_path: str) -> Dict[str, Any]:
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                print(f"WARNING: {file_path} is corrupted or empty. Starting with empty DB.")
                return {}
    return {}

def save_json_db(file_path: str, db: Dict[str, Any]):
    try:
        with open(file_path, "w") as f:
            json.dump(db, f, indent=4)
    except Exception as e:
        print(f"ERROR: Failed to save data to {file_path}: {e}")

# Load all databases on app startup
USERS_DB = load_json_db(config.USERS_DB_FILE)
USER_ACTIVITY_DB = load_json_db(config.USER_ACTIVITY_FILE)
USER_STATS_DB = load_json_db(config.USER_STATS_FILE)

# Backfill user_stats.json for new users if necessary
try:
    updated_stats_db = False
    for email in list(USERS_DB.keys()):
        email_lower = email.lower()
        
        # If the lowercase version of the email is not in the DB,
        # it means the original casing is outdated.
        if email_lower != email:
            # If the lowercase key doesn't already exist, move the data
            if email_lower not in USERS_DB:
                USERS_DB[email_lower] = USERS_DB.pop(email)
            # If the lowercase key DOES exist, it implies a duplicate user
            # that should be merged or handled. For now, we'll just remove the older one.
            else:
                del USERS_DB[email]
            
    # Backfill stats for any user that might not have a stats entry
    for email_lower in USERS_DB:
        if email_lower not in USER_STATS_DB:
            USER_STATS_DB[email_lower] = {
                "actions": [],
                "summary": {"plagiarism_checks": 0, "humanizer_uses": 0, "last_action": None}
            }
            updated_stats_db = True
            
    if updated_stats_db:
        save_json_db(config.USER_STATS_FILE, USER_STATS_DB)
        save_json_db(config.USERS_DB_FILE, USERS_DB) # Also save user DB if modified
        
except Exception as e:
    print(f"ERROR: Could not backfill user_stats.json: {e}")

def log_user_activity(email: str, action: str, details: Optional[Dict[str, Any]] = None):
    email_lower = email.lower()
    
    if email_lower not in USER_ACTIVITY_DB:
        USER_ACTIVITY_DB[email_lower] = []
    USER_ACTIVITY_DB[email_lower].append({"timestamp": datetime.now().isoformat(), "action": action, "details": details or {}})
    save_json_db(config.USER_ACTIVITY_FILE, USER_ACTIVITY_DB)

    if email_lower not in USER_STATS_DB:
        USER_STATS_DB[email_lower] = {
            "actions": [],
            "summary": {"plagiarism_checks": 0, "humanizer_uses": 0, "last_action": None}
        }
    
    USER_STATS_DB[email_lower]["actions"].append({"timestamp": datetime.now().isoformat(), "action": action, "details": details or {}})
    
    if action == "Plagiarism Check":
        USER_STATS_DB[email_lower]["summary"]["plagiarism_checks"] += 1
    elif action == "AI Humanizer":
        USER_STATS_DB[email_lower]["summary"]["humanizer_uses"] += 1
    
    USER_STATS_DB[email_lower]["summary"]["last_action"] = action
    save_json_db(config.USER_STATS_FILE, USER_STATS_DB)

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
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=config.GOOGLE_CLIENT_ID,
    client_secret=config.GOOGLE_CLIENT_SECRET,
    client_kwargs={
        'scope': 'openid email profile'
    }
)
oauth.register(
    name='github',
    client_id=config.GITHUB_CLIENT_ID,
    client_secret=config.GITHUB_CLIENT_SECRET,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)




# --- Authentication Helper Functions ---
def verify_password(plain_password, hashed_password):
    # Truncate password to 72 bytes to comply with bcrypt's limit
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    # Truncate password to 72 bytes to comply with bcrypt's limit
    return pwd_context.hash(password[:72])

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=config.JWT_ALGORITHM)
    return encoded_jwt

def _get_user_email_from_request(request: FastAPIRequest) -> Optional[str]:
    auth_header = request.headers.get('authorization')
    if auth_header and auth_header.startswith('Bearer '):
        try:
            payload = jwt.decode(auth_header.split(' ')[1], SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
            email = payload.get('sub')
            if email:
                email_lower = email.lower()
                if email_lower in USERS_DB:
                    return email_lower
        except JWTError:
            pass
    return None

# --- Static File Serving ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR_ABS = os.path.join(BASE_DIR, config.FRONTEND_DIR_REL)

if not os.path.exists(FRONTEND_DIR_ABS):
    print(f"WARNING: Frontend directory not found at {FRONTEND_DIR_ABS}. Static files will not be served correctly.")
else:
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR_ABS), name="static")

# --- HTML Page Endpoints ---
# Generic route to serve HTML pages from the frontend directory
@app.get("/{page}.html")
async def serve_html_pages(page: str, request: FastAPIRequest):
    protected_pages = ["dashboard", "profile", "history", "settings", "analytics", "api-access", "bulk-uploads", "about"]
    
    # Sanitize page name to prevent directory traversal attacks
    page = os.path.basename(page)

    if page in protected_pages:
        email = _get_user_email_from_request(request)
        if email:
            # The email from _get_user_email_from_request is already lowercase
            log_user_activity(email, f"{page.title()} Visit", f"Visited {page} page.")
    
    html_path = os.path.join(FRONTEND_DIR_ABS, f"{page}.html")
    if os.path.exists(html_path):
        return FileResponse(html_path, media_type="text/html")
    
    raise HTTPException(status_code=404, detail=f"{page}.html not found.")


@app.get("/frontend/auth-callback.html")
async def serve_auth_callback():
    auth_callback_path = os.path.join(FRONTEND_DIR_ABS, "auth-callback.html")
    if os.path.exists(auth_callback_path):
        return FileResponse(auth_callback_path)
    raise HTTPException(status_code=404, detail="auth-callback.html not found.")

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
@app.post("/api/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    try:
        email_lower = user_data.email.lower()
        if email_lower in USERS_DB:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = get_password_hash(user_data.password)
        user_id = str(len(USERS_DB) + 1)
        
        user = {
            "id": user_id, 
            "firstName": user_data.firstName, 
            "lastName": user_data.lastName,
            "email": email_lower,  # Use the lowercase email
            "userType": user_data.userType, 
            "plan": "free",
            "created_at": datetime.now().isoformat(), 
            "newsletter": user_data.newsletter
        }
        
        USERS_DB[email_lower] = {**user, "hashed_password": hashed_password}
        save_json_db(config.USERS_DB_FILE, USERS_DB)
        
        # Ensure user stats entry exists upon registration
        if email_lower not in USER_STATS_DB:
            USER_STATS_DB[email_lower] = {
                "actions": [],
                "summary": {"plagiarism_checks": 0, "humanizer_uses": 0, "last_action": None}
            }
            save_json_db(config.USER_STATS_FILE, USER_STATS_DB)

        access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": email_lower}, expires_delta=access_token_expires)
        
        return {"access_token": access_token, "token_type": "bearer", "user": user}
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Registration failed in backend: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    try:
        email_lower = user_credentials.email.lower()
        if email_lower not in USERS_DB:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        stored_user = USERS_DB[email_lower]
        if not isinstance(stored_user.get("hashed_password"), str):
            raise HTTPException(status_code=500, detail="Corrupted user data")
        
        if not verify_password(user_credentials.password, stored_user["hashed_password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
        if user_credentials.rememberMe:
            access_token_expires = timedelta(days=config.REMEMBER_ME_TOKEN_EXPIRE_DAYS)
            
        access_token = create_access_token(data={"sub": email_lower}, expires_delta=access_token_expires)
        user_data = {k: v for k, v in stored_user.items() if k != "hashed_password"}
        
        return {"access_token": access_token, "token_type": "bearer", "user": user_data}
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Login failed in backend: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.post("/api/auth/forgot-password")
async def forgot_password(reset_data: PasswordReset):
    try:
        email_lower = reset_data.email.lower()
        if email_lower not in USERS_DB:
            # Still return a generic message to avoid user enumeration
            return {"message": "If the email exists, a reset link has been sent"}
        
        # In a real application, you would generate a password reset token,
        # save it, and email it to the user.
        print(f"Password reset requested for: {email_lower}")
        
        return {"message": "Password reset link sent successfully"}
    except Exception as e:
        print(f"ERROR: Forgot password failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Password reset failed: {str(e)}")

@app.get("/api/auth/verify-token")
async def verify_token(authorization: str = Header(None)):
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[config.JWT_ALGORITHM])
        email: str = payload.get("sub")
        
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token: subject missing")
            
        email_lower = email.lower()
        if email_lower not in USERS_DB:
            raise HTTPException(status_code=401, detail="Invalid token: user not found")
            
        user_data = {k: v for k, v in USERS_DB[email_lower].items() if k != "hashed_password"}
        return {"user": user_data}
        
    except JWTError as e:
        print(f"ERROR: JWT decoding failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"ERROR: Token verification failed: {e}")
        raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")

from fastapi.responses import RedirectResponse
import urllib.parse

async def social_login(user_info: dict):
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email not provided by social provider")

    email_lower = email.lower()
    if email_lower in USERS_DB:
        user = USERS_DB[email_lower]
        access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": user['email']}, expires_delta=access_token_expires)
        
        response = RedirectResponse(url=f"/frontend/auth-callback.html?token={access_token}&user={urllib.parse.quote(json.dumps(user))}")
        return response

    user_id = str(len(USERS_DB) + 1)
    user = {
        "id": user_id,
        "firstName": user_info.get("given_name", ""),
        "lastName": user_info.get("family_name", ""),
        "email": email_lower,
        "userType": "student",
        "plan": "free",
        "created_at": datetime.now().isoformat(),
        "newsletter": False,
    }
    USERS_DB[email_lower] = {**user, "hashed_password": ""}
    save_json_db(config.USERS_DB_FILE, USERS_DB)

    if email_lower not in USER_STATS_DB:
        USER_STATS_DB[email_lower] = {
            "actions": [],
            "summary": {"plagiarism_checks": 0, "humanizer_uses": 0, "last_action": None}
        }
        save_json_db(config.USER_STATS_FILE, USER_STATS_DB)

    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user['email']}, expires_delta=access_token_expires)
    
    response = RedirectResponse(url=f"/frontend/auth-callback.html?token={access_token}&user={urllib.parse.quote(json.dumps(user))}")
    return response

@app.get("/api/auth/google/login")
async def google_login(request: FastAPIRequest):
    redirect_uri = str(request.url_for('google_callback')).replace("127.0.0.1", "localhost")
    redirect_uri = redirect_uri.rstrip("/")  # Just to avoid accidental trailing slash
    return await oauth.google.authorize_redirect(request, redirect_uri)


@app.get("/api/auth/google/callback")
async def google_callback(request: FastAPIRequest):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(request, token)
    return await social_login(user_info)

@app.get("/api/auth/github/login")
async def github_login(request: FastAPIRequest):
    redirect_uri = str(request.url_for("github_callback")).replace("127.0.0.1", "localhost")
    redirect_uri = redirect_uri.rstrip("/")  # Just to avoid accidental trailing slash
    return await oauth.github.authorize_redirect(request, redirect_uri)



@app.get("/api/auth/github/callback")
async def github_callback(request: FastAPIRequest):
    token = await oauth.github.authorize_access_token(request)
    resp = await oauth.github.get('user', token=token)
    user_info = resp.json()
    return await social_login(user_info)

# --- Core API Endpoints (calling ai_model functions) ---
@app.post("/api/check-plagiarism", response_model=PlagiarismResult)
async def check_plagiarism_endpoint(request_data: PlagiarismRequest, fastapi_request: FastAPIRequest):
    email = _get_user_email_from_request(fastapi_request)
    try:
        start_time = datetime.now()
        plagiarism_result = await analyze_with_groq_api(request_data.text, "plagiarism")
        ai_detection_result = await analyze_with_groq_api(request_data.text, "ai_detection") if request_data.check_ai_content else {"is_ai": False, "confidence": 0.0}
        processing_time = (datetime.now() - start_time).total_seconds()
        word_count = len(request_data.text.split())
        plagiarism_score = plagiarism_result.get("score", 0.0)
        
        result_obj = PlagiarismResult(
            plagiarism_score=plagiarism_score,
            is_ai_generated=ai_detection_result.get("is_ai", False),
            ai_confidence=ai_detection_result.get("confidence", 0.0),
            sources_found=plagiarism_result.get("sources", []),
            word_count=word_count,
            analysis_time=processing_time,
            unique_content_percentage=100 - plagiarism_score
        )
        if email:
            log_user_activity(email, "Plagiarism Check", {
                "input_preview": request_data.text[:100] + "..." if len(request_data.text) > 100 else request_data.text,
                "plagiarism_score": plagiarism_score,
                "is_ai_generated": ai_detection_result.get("is_ai", False),
                "word_count": word_count
            })

                # ===== Supabase Save: Plagiarism Check =====
        try:
            # 1) Document insert
            doc_insert = supabase.table("documents").insert({
                "user_id": None,  # अभी user linking नहीं करेंगे
                "title": "Plagiarism Check",
                "original_text": request_data.text,
                "language": "en"
            }).execute()

            document_id = doc_insert.data[0]["id"]

            # 2) Check result insert
            check_insert = supabase.table("checks").insert({
                "user_id": None,
                "document_id": document_id,
                "check_type": "single",
                "similarity": plagiarism_score,
                "risk_level": (
                    "high" if plagiarism_score >= 70 
                    else "moderate" if plagiarism_score >= 30 
                    else "safe"
                ),
                "status": "completed",
                "words_count": word_count,
                "runtime_ms": int(processing_time * 1000)
            }).execute()

            check_id = check_insert.data[0]["id"]

            # 3) Matched sources insert
            for s in plagiarism_result.get("sources", []):
                supabase.table("check_sources").insert({
                    "check_id": check_id,
                    "source_type": s.get("type", "web"),
                    "source_title": s.get("title"),
                    "url": s.get("url"),
                    "similarity": s.get("score"),
                    "snippet": s.get("snippet")
                }).execute()

        except Exception as err:
            print("SUPABASE ERROR (CHECK): ", err)
        # ===== END Supabase Save =====

        return result_obj
    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL ERROR in check_plagiarism_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/humanize-text", response_model=HumanizeResult)
async def humanize_text_endpoint(request_data: HumanizeRequest, fastapi_request: FastAPIRequest):
    email = _get_user_email_from_request(fastapi_request)
    try:
        start_time = datetime.now()
        humanize_result = await humanize_with_groq_api(request_data.text, request_data.writing_style, request_data.complexity_level)
        improvement_score = calculate_improvement_score(request_data.text, humanize_result.get("humanized_text", ""))
        word_count = len(humanize_result.get("humanized_text", "").split())
        processing_time = (datetime.now() - start_time).total_seconds()
        
        result_obj = HumanizeResult(
            original_text=request_data.text,
            humanized_text=humanize_result.get("humanized_text", ""),
            improvement_score=improvement_score,
            changes_made=humanize_result.get("changes", []),
            word_count=word_count,
            processing_time=processing_time
        )
        if email:
            log_user_activity(email, "AI Humanizer", {
                "input_preview": request_data.text[:100] + "..." if len(request_data.text) > 100 else request_data.text,
                "humanized_word_count": word_count,
                "improvement_score": improvement_score
            })

                # ===== Supabase Save: Humanizer =====
        try:
            supabase.table("humanize_requests").insert({
                "user_id": None,
                "document_id": None,
                "level": request_data.complexity_level,
                "input_text": request_data.text,
                "output_text": result_obj.humanized_text
            }).execute()
        except Exception as err:
            print("SUPABASE ERROR (HUMANIZER): ", err)
        # ===== END Supabase Humanizer Save =====

        return result_obj
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

@app.post("/api/upload-file")
async def upload_file_endpoint(file: UploadFile = File(...)):
    """
    Handles file uploads and extracts text content.
    """
    try:
        allowed_types = ["text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.")
        
        content = await file.read()
        extracted_text = ""

        if file.content_type == "text/plain":
            extracted_text = content.decode('utf-8')
        elif file.content_type == "application/pdf":
            with io.BytesIO(content) as pdf_file:
                reader = PdfReader(pdf_file)
                for page in reader.pages:
                    extracted_text += page.extract_text()
        elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            with io.BytesIO(content) as docx_file:
                doc = Document(docx_file)
                for para in doc.paragraphs:
                    extracted_text += para.text + "\n"

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
async def download_humanized_content(request_data: DownloadHumanizedRequest):
    text_content = request_data.text
    download_format = request_data.format
    try:
        # Calls the generate_humanized_doc function from ai_model.py
        file_stream, media_type, filename = generate_humanized_doc(text_content, download_format)
        return StreamingResponse(file_stream, media_type=media_type, headers={"Content-Disposition": f"attachment; filename={filename}"})
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: Failed to generate {download_format} document: {e}")
        raise HTTPException(status_code=500, detail=f"Server error generating document: {str(e)}")

# --- User Activity and Stats API Endpoints ---
@app.get("/api/user/activity")
async def get_user_activity_endpoint(email: str = Query(...)):
    email_lower = email.lower()
    return {"activity": USER_ACTIVITY_DB.get(email_lower, [])}

@app.get("/api/user/stats")
async def get_user_stats_endpoint(email: str = Query(...)):
    email_lower = email.lower()
    user_stats = USER_STATS_DB.get(email_lower)
    if user_stats and "summary" in user_stats:
        return {"stats": user_stats["summary"]}
    else:
        return {"stats": {"plagiarism_checks": 0, "humanizer_uses": 0, "last_action": None}}

@app.get("/api/user/download-activity")
async def download_user_activity_endpoint(email: str = Query(...), idx: int = Query(...), type: str = Query("pdf")):
    email_lower = email.lower()
    user_acts = USER_ACTIVITY_DB.get(email_lower, [])
    if idx < 0 or idx >= len(user_acts):
        raise HTTPException(status_code=404, detail="Activity not found.")
    entry = user_acts[idx]
    doc_title = entry.get("details", {}).get("input_preview", "") or entry.get("action") or "Document"
    filename_base = f"{doc_title[:30].replace(' ','_').replace('/','-')}".replace("__", "_")
    
    # Generate activity report document directly in main.py
    if type == "pdf":
        if FPDF is None:
            raise HTTPException(status_code=500, detail="PDF export not available. Please install 'fpdf' library.")
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=14)
        pdf.cell(200, 10, txt="User Activity Export", ln=True, align="C")
        pdf.ln(10)
        pdf.set_font("Arial", size=12)
        details_text = "\n".join([f"{k.replace('_', ' ').title()}: {v}" for k, v in entry.get("details", {}).items()])
        pdf.cell(0, 10, txt=f"Action: {entry.get('action','')}", ln=True)
        pdf.cell(0, 10, txt=f"Timestamp: {entry.get('timestamp','')}", ln=True)
        pdf.multi_cell(0, 10, txt=f"Details:\n{details_text}".encode('latin-1', 'replace').decode('latin-1'))
        # Using pdf.output(dest='S') then io.BytesIO is a common pattern for FPDF
        pdf_output = io.BytesIO(pdf.output(dest='S'))
        pdf_output.seek(0)
        return StreamingResponse(pdf_output, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={filename_base}.pdf"})
    elif type == "word":
        if Document is None:
            raise HTTPException(status_code=500, detail="Word export not available. Please install 'python-docx' library.")
        doc = Document()
        doc.add_heading("User Activity Export", 0)
        doc.add_paragraph(f"Action: {entry.get('action','')}")
        doc.add_paragraph(f"Timestamp: {entry.get('timestamp','')}")
        for k, v in entry.get("details", {}).items():
            doc.add_paragraph(f"{k.replace('_', ' ').title()}: {v}")
        word_output = io.BytesIO()
        doc.save(word_output)
        word_output.seek(0)
        return StreamingResponse(word_output, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={"Content-Disposition": f"attachment; filename={filename_base}.docx"})
    else:
        raise HTTPException(status_code=400, detail="Invalid file type requested.")

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