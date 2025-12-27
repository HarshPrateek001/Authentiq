from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# --- Pydantic Models for API Requests and Responses ---
# These models define the API contract for data flowing in and out of the application.

class PlagiarismRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text content to check for plagiarism.")
    check_ai_content: Optional[bool] = Field(True, description="Whether to also check if content is AI-generated.")
    language: Optional[str] = Field("en", description="Language of the text (e.g., 'en', 'es').")

class PlagiarismResult(BaseModel):
    plagiarism_score: float = Field(..., ge=0, le=100, description="Percentage of plagiarism detected.")
    is_ai_generated: bool = Field(..., description="True if the content is detected as AI-generated.")
    ai_confidence: float = Field(..., ge=0, le=100, description="Confidence score for AI detection.")
    sources_found: List[Dict[str, Any]] = Field(default_factory=list, description="List of potential matching sources.")
    word_count: int = Field(..., ge=0, description="Word count of the analyzed text.")
    analysis_time: float = Field(..., ge=0, description="Time taken for analysis in seconds.")
    unique_content_percentage: float = Field(..., ge=0, le=100, description="Percentage of unique content.")

class HumanizeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="AI-generated text to humanize.")
    writing_style: Optional[str] = Field("natural", description="Desired writing style (e.g., 'natural', 'academic', 'creative', 'professional').")
    complexity_level: Optional[str] = Field("moderate", description="Desired complexity level (e.g., 'simple', 'moderate', 'advanced').")
    preserve_meaning: Optional[bool] = Field(True, description="Attempt to preserve original meaning during humanization.")

class HumanizeResult(BaseModel):
    original_text: str = Field(..., description="The original AI-generated text.")
    humanized_text: str = Field(..., description="The transformed human-like text.")
    improvement_score: float = Field(..., ge=0, le=100, description="Estimated improvement in human-likeness.")
    changes_made: List[str] = Field(default_factory=list, description="Descriptions of changes applied during humanization.")
    word_count: int = Field(..., ge=0, description="Word count of the humanized text.")
    processing_time: float = Field(..., ge=0, description="Time taken for processing in seconds.")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's message to the AI chatbot.")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI chatbot's response.")

class DownloadHumanizedRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Humanized text content to download.")
    format: str = Field(..., pattern="^(txt|word|pdf)$", description="Desired download format (txt, word, pdf).")

# --- Authentication Models ---
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    userType: str
    newsletter: Optional[bool] = False

class UserLogin(BaseModel):
    email: str
    password: str
    rememberMe: Optional[bool] = False

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class PasswordReset(BaseModel):
    email: str