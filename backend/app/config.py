from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./travel_agent.db"
)

CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")

APP_NAME = os.getenv(
    "APP_NAME",
    "Travel Content Agent"
)