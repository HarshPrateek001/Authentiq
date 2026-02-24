import os
from typing import Dict, Any, List, Optional


class Config:

    from dotenv import load_dotenv

    load_dotenv()  # Load variables from .env
    
    """Centralized configuration settings for the PlagiarismPro backend."""

    # --- Application Settings ---
    APP_TITLE = "PlagiarismPro AI Backend"
    APP_DESCRIPTION = "Advanced plagiarism detection and AI content humanization service."
    APP_VERSION = "1.0.0"

    # --- Supabase Settings ---
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


    # --- Server Settings ---
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    RELOAD = os.getenv("RELOAD", "True").lower() == "true" # For development, set to 'False' in production
    LOG_LEVEL = os.getenv("LOG_LEVEL", "info").lower()

    # --- CORS Settings ---
    # In production, ALLOWED_ORIGINS should be specific frontend domains
    ALLOWED_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "*").split(",")
    
    @classmethod
    def get_cors_settings(cls) -> Dict[str, Any]:
        return {
            "allow_origins": cls.ALLOWED_ORIGINS,
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"]
        }

    # --- Security Settings ---
    # Path to the file storing the generated SECRET_KEY
    SECRET_KEY_FILE: str = "secret_key.txt"
    # JWT Algorithm
    JWT_ALGORITHM: str = "HS256"
    # Access Token Expiration (minutes)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # Extended Access Token Expiration (days) for "remember me"
    REMEMBER_ME_TOKEN_EXPIRE_DAYS: int = 30

    # --- Database (File-based for Demo) Settings ---
    USERS_DB_FILE: str = "users_db.json"
    USER_ACTIVITY_FILE: str = "user_activity.json"
    USER_STATS_FILE: str = "user_stats.json"

    # --- Frontend Paths ---
    # Relative path to the frontend directory from the backend directory
    FRONTEND_DIR_REL: str = os.path.join("..", "frontend")
    
    # URL of the frontend application (for redirects)
    # Detect if incorrectly set to backend port and correct it
    _env_frontend_url = os.getenv("FRONTEND_URL")
    if _env_frontend_url and "8000" in _env_frontend_url:
        FRONTEND_URL: str = "http://localhost:3000"
    else:
        FRONTEND_URL: str = _env_frontend_url or "http://localhost:3000"

    @classmethod
    def get(cls, key: str, default: Any = None) -> Any:
        return getattr(cls, key, default)

    # --- Social Login (OAuth) Settings ---
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET", "YOUR_GOOGLE_CLIENT_SECRET")

    # GitHub OAuth
    GITHUB_CLIENT_ID: Optional[str] = os.getenv("GITHUB_CLIENT_ID", "YOUR_GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: Optional[str] = os.getenv("GITHUB_CLIENT_SECRET", "YOUR_GITHUB_CLIENT_SECRET")

    # --- Groq AI Model Settings ---
    # Load Groq API Key from environment variable
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    # Groq API Base URL
    GROQ_API_URL: str = "https://api.groq.com/openai/v1/chat/completions"
    # Default Groq model to use for AI responses
    # Corrected: Changed model to llama3-8b-8192
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    # API Timeout (seconds)
    GROQ_API_TIMEOUT: float = 60.0

    # --- Heuristic/Fallback AI Detection Patterns ---
    # Patterns for basic AI content detection (used if Groq API is unavailable)
    AI_PATTERNS: List[str] = [
        r'\b(furthermore|moreover|additionally|consequently)\b',
        r'\b(utilize|facilitate|implement|optimize)\b',
        r'\b(comprehensive|extensive|significant|substantial)\b',
        r'\b(it is important to note|it should be noted)\b',
        r'\b(in conclusion|to summarize|in summary)\b',
        r'\b(therefore|thus|hence)\b',
        r'\b(however|nevertheless)\b',
        r'\b(seamlessly|strategically|effectively)\b',
        r'\b(various|numerous|diverse)\b',
        r'\b(provides insight into|delves into|underscores the importance of)\b'
    ]

    # --- Humanization Rules (for fallback) ---
    HUMANIZATION_RULES: Dict[str, Dict[str, str]] = {
        "formal_to_casual": {
            r'\butilize\b': 'use', r'\bfacilitate\b': 'help', r'\bimplement\b': 'put in place',
            r'\boptimize\b': 'improve', r'\bsubstantial\b': 'big', r'\bsignificant\b': 'important',
            r'\bFurthermore,\b': 'Also,', r'\bMoreover,\b': 'And,', r'\bTherefore,\b': 'So,',
            r'\bHowever,\b': 'But,'
        }, 
        "ai_to_human": {
            r'\bin conclusion\b': 'to wrap things up', r'\bit is important to note\b': 'it\'s worth mentioning',
            r'\bit should be noted\b': 'keep in mind', r'\b(the purpose of this is|this aims to)\b': 'we want to',
            r'\b(in the context of|regarding)\b': 'about', r'\b(delve into|explore)\b': 'look into'
        },
        "complexity_reduction": {
            r'\bextraordinarily\b': 'very', r'\bexceptionally\b': 'really', r'\bpredominantly\b': 'mostly',
            r'\bconsequently\b': 'so', r'\bnevertheless\b': 'still', r'\b(endeavor to|strive to)\b': 'try to',
            r'\b(subsequently|afterward)\b': 'then', r'\b(ameliorate|improve)\b': 'make better'
        }
    }

    # --- Content Moderation Keywords ---
    MODERATION_KEYWORDS: List[str] = [
        "sex", "suicide", "kill", "murder", "hate", "racist", "nazi", "terrorist",
        "bomb", "weapon", "drugs", "illegal", "harm", "violence", "porn", "explicit",
        "abuse", "child exploitation", "self-harm", "sexual", "assault"
    ]

    # --- Mock Sources for Plagiarism Fallback ---
    MOCK_SOURCES: List[Dict[str, Any]] = [
        {"title": "Advanced Research Methodologies", "url": "https://academic-journal.example.com/article/123", "type": "academic_paper", "similarity": 0.85, "matched_words": 45},
        {"title": "Content Originality in the Digital Age", "url": "https://research-portal.example.com/paper/456", "type": "research_paper", "similarity": 0.72, "matched_words": 32},
        {"title": "Plagiarism Detection Technologies", "url": "https://tech-review.example.com/articles/789", "type": "article", "similarity": 0.68, "matched_words": 28}
    ]

# Initialize and export the config instance
config = Config()