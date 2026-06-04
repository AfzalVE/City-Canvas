from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./travel_agent.db"
)

LLM_PROVIDER = os.getenv(
    "LLM_PROVIDER",
    "groq"
).lower()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile"
)

CLAUDE_MODEL = os.getenv(
    "CLAUDE_MODEL",
    "claude-sonnet-4-20250514"
)

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")

APP_NAME = os.getenv(
    "APP_NAME",
    "Travel Content Agent"
)

ADMIN_USERNAME = os.getenv(
    "ADMIN_USERNAME",
    "admin"
)

ADMIN_PASSWORD = os.getenv(
    "ADMIN_PASSWORD",
    "admin123"
)

ADMIN_API_TOKEN = os.getenv(
    "ADMIN_API_TOKEN",
    "dev-admin-token"
)

ENABLE_RSS_SCHEDULER = os.getenv(
    "ENABLE_RSS_SCHEDULER",
    "true"
).lower() == "true"

RSS_SCHEDULE_HOUR = int(
    os.getenv(
        "RSS_SCHEDULE_HOUR",
        "9"
    )
)

RSS_SCHEDULE_MINUTE = int(
    os.getenv(
        "RSS_SCHEDULE_MINUTE",
        "0"
    )
)

RSS_SCHEDULE_TIMEZONE = os.getenv(
    "RSS_SCHEDULE_TIMEZONE",
    "Asia/Kolkata"
)
