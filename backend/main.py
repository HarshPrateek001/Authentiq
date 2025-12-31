from fastapi import FastAPI, HTTPException, UploadFile, File, Header, Request as FastAPIRequest, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from supabase_client import supabase
from models import PlagiarismResult, PlagiarismRequest, HumanizeRequest, HumanizeResult
import uvicorn
import os
import json
from datetime import datetime, timedelta
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
import io
from PyPDF2 import PdfReader
from docx import Document
from config import config
from models import (PlagiarismRequest, HumanizeRequest, ChatRequest, PlagiarismResult, HumanizeResult, ChatResponse, DownloadHumanizedRequest)

from ai_model import (
    analyze_with_groq_api, humanize_with_groq_api, chat_with_groq_api,
    calculate_plagiarism_score, detect_ai_content, find_potential_sources,
    apply_humanization_rules, calculate_improvement_score, get_local_chat_response_fallback,
    moderate_message, generate_humanized_doc,
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

print("Loaded GROQ API Key:", os.getenv("GROQ_API_KEY"))



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




# --- Core API Endpoints (calling ai_model functions) ---
@app.post("/api/check-plagiarism", response_model=PlagiarismResult)
async def check_plagiarism_endpoint(request_data: PlagiarismRequest, fastapi_request: FastAPIRequest):
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
    email = None
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