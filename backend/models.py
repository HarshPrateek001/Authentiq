from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Generic, TypeVar

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    success: bool = Field(True, description="Whether the request was successful")
    plan: str = Field(..., description="The user's current plan")
    remaining_words: int = Field(..., description="Remaining word quota")
    used_words: int = Field(..., description="Used word quota")
    limit: int = Field(..., description="Total word quota limit")
    data: T = Field(..., description="Actual response data")

# --- Pydantic Models for API Requests and Responses ---
# These models define the API contract for data flowing in and out of the application.

class PlagiarismRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text content to check for plagiarism.")
    check_ai_content: Optional[bool] = Field(True, description="Whether to also check if content is AI-generated.")
    language: Optional[str] = Field("en", description="Language of the text (e.g., 'en', 'es').")
    title: Optional[str] = Field(None, description="Title of the document.")
    category: Optional[str] = Field(None, description="Category of the content (e.g., 'academic', 'blog').")
    cross_language: Optional[bool] = Field(False, description="Enable cross-language plagiarism detection.")

class RiskPredictionRequest(BaseModel):
    text: str = Field(..., min_length=50, description="Text to analyze for risk prediction (min 50 words).")

class ContactFormRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    subject: str
    message: str

class RiskPredictionResult(BaseModel):
    vocabulary_score: int
    structure_score: int
    risk_level: str
    overall_risk: int

class PlagiarismResult(BaseModel):
    id: Optional[str] = Field(None, description="Unique identifier for the report.")
    plagiarism_score: float = Field(..., ge=0, le=100, description="Percentage of plagiarism detected.")
    is_ai_generated: bool = Field(..., description="True if the content is detected as AI-generated.")
    ai_confidence: float = Field(..., ge=0, le=100, description="Confidence score for AI detection.")
    sources_found: List[Dict[str, Any]] = Field(default_factory=list, description="List of potential matching sources.")
    word_count: int = Field(..., ge=0, description="Word count of the analyzed text.")
    analysis_time: float = Field(..., ge=0, description="Time taken for analysis in seconds.")
    unique_content_percentage: float = Field(..., ge=0, le=100, description="Percentage of unique content.")
    ai_flagged_segments: List[str] = Field(default_factory=list, description="List of text segments flagged as AI-generated.")
    
    # New fields for advanced plagiarism detection (Step 6)
    originality_level: Optional[str] = Field(None, description="Originality level: High, Medium, Low")
    similarity_range: Optional[str] = Field(None, description="Similarity range, e.g., '40-60%'")
    confidence: Optional[str] = Field(None, description="Confidence in the result")
    analysis_summary: Optional[str] = Field(None, description="Summary reasoning of the analysis")
    matched_patterns: Optional[List[str]] = Field(default_factory=list, description="Array of matching patterns")
    api_used: Optional[bool] = Field(None, description="Whether the external API was used")

class HumanizeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="AI-generated text to humanize.")
    writing_style: Optional[str] = Field("natural", description="Desired writing style (e.g., 'natural', 'academic', 'creative', 'professional').")
    complexity_level: Optional[str] = Field("moderate", description="Desired complexity level (e.g., 'simple', 'moderate', 'advanced').")
    preserve_meaning: Optional[bool] = Field(True, description="Attempt to preserve original meaning during humanization.")
    target_language: Optional[str] = Field("English", description="Target language for the humanized output.")
    content_type: Optional[str] = Field("article", description="Type of content (e.g., article, blog, research_paper, email).")

class HumanizeResult(BaseModel):
    original_text: str = Field(..., description="The original AI-generated text.")
    humanized_text: str = Field(..., description="The transformed human-like text.")
    improvement_score: float = Field(..., ge=0, le=100, description="Estimated improvement in human-likeness.")
    changes_made: List[str] = Field(default_factory=list, description="Descriptions of changes applied during humanization.")
    word_count: int = Field(..., ge=0, description="Word count of the humanized text.")
    processing_time: float = Field(..., ge=0, description="Time taken for processing in seconds.")
    original_ai_score: float = Field(..., ge=0, le=100, description="AI confidence score of original text.")
    humanized_ai_score: float = Field(..., ge=0, le=100, description="AI confidence score of humanized text.")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's message to the AI chatbot.")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI chatbot's response.")

class DownloadHumanizedRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Humanized text content to download.")
    format: str = Field(..., pattern="^(txt|word|pdf)$", description="Desired download format (txt, word, pdf).")

# --- Authentication Models ---
class UserCreate(BaseModel):
    fullName: str
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

class SubscriptionRequest(BaseModel):
    plan_id: str
    billing_cycle: str
    amount: float
    payment_method: str
    order_id: str

class RefundRequestModel(BaseModel):
    email: str
    order_id: str
    reason: str
    description: str

class UserSettingsModel(BaseModel):
    language: Optional[str] = "en"
    default_doc_type: Optional[str] = "assignment"
    report_privacy: Optional[str] = "private"
    email_notifications: Optional[bool] = True
    report_ready: Optional[bool] = True
    high_risk_alerts: Optional[bool] = True
    usage_warnings: Optional[bool] = True
    weekly_digest: Optional[bool] = False
    analysis_depth: Optional[int] = 75

class LogActivityRequest(BaseModel):
    action: str = Field(..., description="Type of action, e.g., 'page_view', 'button_click'")
    details: Dict[str, Any] = Field(default_factory=dict, description="Additional details about the action")