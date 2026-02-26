from fastapi import FastAPI, HTTPException, UploadFile, File, Header, Request as FastAPIRequest, Query, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
# from supabase_client import supabase  # REPLACED WITH LOCAL DB
from local_db import local_db # Local JSON DB
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
    RiskPredictionRequest, RiskPredictionResult, LogActivityRequest
)
from ai_model import (
    analyze_with_groq_api, humanize_with_groq_api, chat_with_groq_api,
    calculate_plagiarism_score, detect_ai_content, find_potential_sources,
    apply_humanization_rules, calculate_improvement_score, get_local_chat_response_fallback,
    moderate_message, generate_humanized_doc, extract_text_from_bytes, execute_advanced_plagiarism_check
)


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
        # Save to Local JSON DB
        user = local_db.create_user(user_data.dict())
        return {"message": "User registered successfully", "user": user}

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def login_user(user_data: UserLogin):
    try:
        # Check Local JSON DB
        auth_result = local_db.authenticate_user(user_data.email, user_data.password)
        
        if auth_result:
            return {
                "access_token": auth_result["token"],
                "token_type": "bearer",
                "user": auth_result["user"]
            }
        else:
             raise HTTPException(status_code=401, detail="Invalid credentials")

    except Exception as e:
        print(f"Login Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials or server error")

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
    user = local_db.get_user_by_token(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
        
    return user

@app.post("/api/subscribe")
async def subscribe_user(request: SubscriptionRequest, authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    try:
        # Extract user from token
        token = authorization.replace("Bearer ", "")
        user = local_db.get_user_by_token(token)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        # Log Transaction and Update Subscription in LocalDB
        transaction_data = {
            "plan_id": request.plan_id,
            "billing_cycle": request.billing_cycle,
            "amount": request.amount,
            "payment_method": request.payment_method,
            "order_id": request.order_id,
            "timestamp": datetime.now().isoformat()
        }
        
        success = local_db.record_transaction(user["email"], transaction_data)
        
        if success:
            return {"status": "success", "message": "Subscription activated", "plan": request.plan_id}
        else:
            raise HTTPException(status_code=500, detail="Failed to record transaction")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Subscription Error: {e}")
        return {"status": "error", "message": str(e)}

@app.post("/api/request-refund")
async def request_refund(request: RefundRequestModel):
    try:
        # In a real app, save to a 'refund_requests' table.
        print(f"Refund Request Received: {request}")
        # await supabase.table("refunds").insert(request.dict()).execute()
        return {"status": "success", "message": "Refund request received"}
    except Exception as e:
        print(f"Refund Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process refund request")

# --- Helper Hooks for Advanced Pipeline ---
def check_user_limits(user: dict, action: str, check_cost: int = 1) -> dict:
    limits_data = local_db.get_user_limits(user["email"])
    if not limits_data:
        return {"plan": "free", "limit": 5000, "used_words": 0, "remaining_words": 5000}
    
    plan = limits_data["plan"]
    limits = limits_data["limits"]
    usage = limits_data["usage"]
    
    if action == "plagiarism":
        used = usage.get("plagiarism_words", 0)
        limit = limits.get("plagiarism", 5000)
        if used + check_cost > limit:
            raise HTTPException(status_code=402, detail=f"Monthly plagiarism word limit reached for {plan.upper()} plan. Upgrade required.")
        return {"plan": plan, "limit": limit, "used_words": used, "remaining_words": limit - used}
        
    elif action == "humanize":
        used = usage.get("humanize_words", 0)
        limit = limits.get("humanizer", 0)
        if limit == 0:
            raise HTTPException(status_code=403, detail=f"AI Humanizer is not available on your {plan.upper()} plan.")
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
            user = local_db.get_user_by_token(token)
            
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
        user_id = user["email"] if user else "anonymous"
        background_tasks.add_task(
            log_audit_async, 
            user_id, word_count, text_hash, 
            adv_plag_result.get("api_used", False), 
            adv_plag_result.get("analysis_summary", "")
        )

        # Local DB Activity Log
        if user:
             details = result_obj.dict()
             details['original_text'] = request_data.text
             report_id = local_db.log_activity(user["email"], "plagiarism_check", details)
             result_obj.id = report_id

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
            user = local_db.get_user_by_token(token)
            
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
        user_id = user["email"] if user else "anonymous"
        background_tasks.add_task(
            log_audit_async, 
            user_id, word_count, text_hash, 
            adv_plag_result.get("api_used", False), 
            adv_plag_result.get("analysis_summary", "")
        )
        
        # ===== Local DB Log Activity =====
        if user:
             details = result_obj.dict()
             details["file_name"] = file.filename
             details["file_type"] = file.content_type
             details['original_text'] = extracted_text
             report_id = local_db.log_activity(user["email"], "plagiarism_check", details)
             result_obj.id = report_id
        # =================================

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
async def get_report_endpoint(report_id: str):
    report = local_db.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.post("/api/humanizer", response_model=APIResponse[HumanizeResult])
async def humanize_text_endpoint(request_data: HumanizeRequest, fastapi_request: FastAPIRequest):
    try:
        user = None
        auth_header = fastapi_request.headers.get("Authorization")
        if auth_header:
            token = auth_header.replace("Bearer ", "")
            user = local_db.get_user_by_token(token)

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
        # try:
        #     supabase.table("humanize_requests").insert({...}).execute()
        # except Exception as err:
        #     print("SUPABASE ERROR (HUMANIZER): ", err)
        # ===== END Supabase Humanizer Save =====

        # ===== Local DB Log Activity =====
        if user:
             local_db.log_activity(user["email"], "humanize_text", result_obj.dict())
        # =================================

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

@app.get("/api/reports/{report_id}")
async def get_report(report_id: str):
    """
    Fetches a detailed report by ID.
    Currently mocks data if ID not found in DB, or returns DB data.
    """
    try:
        # Try to fetch from Supabase
        # check_res = supabase.table("checks").select("*").eq("id", report_id).execute()
        
        # if not check_res.data:
        #     # Fallback for demo/mock IDs
        if True: # Always use mock fallbacks for now since SB is disabled and LocalDB lookup not implemented yet for specific check IDs
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
            raise HTTPException(status_code=404, detail="Report not found (Local Mode: Only ID '1' is mocked)")
        
        # doc_res = supabase.table("documents").select("*").eq("id", document_id).execute()
        # ...
        # doc_data = doc_res.data[0] if doc_res.data else {}
        
        # # 3. Fetch Sources
        # sources_res = supabase.table("check_sources").select("*").eq("check_id", report_id).execute()
        # sources = sources_res.data if sources_res.data else []
        
        # # Construct Response
        # return {
        #     "id": report_id,
        #     ...
        # }

    except Exception as e:
        print(f"Error fetching report: {e}")
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
        # ===== Local DB Log Activity =====
        auth_header = fastapi_request.headers.get("Authorization")
        if auth_header:
            token = auth_header.replace("Bearer ", "")
            user = local_db.get_user_by_token(token)
            if user:
                 local_db.log_activity(user["email"], "file_download", {
                     "format": download_format,
                     "word_count": len(text_content.split())
                 })
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
        user = local_db.get_user_by_token(token)
        if user:
            local_db.log_activity(user["email"], request_data.action, request_data.details)
            return {"status": "logged"}
    except Exception:
        pass # Fail silently for logging
    return {"status": "ignored"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.replace("Bearer ", "")
    user = local_db.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
        
    return local_db.get_dashboard_stats(user["email"])


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