from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

from app.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    },
    echo=False
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def ensure_database_schema():

    if not DATABASE_URL.startswith("sqlite"):
        return

    table_columns = {
        "feeds": {
            "scoring_breakdown": "TEXT",
            "scoring_reason": "TEXT",
            "scoring_confidence": "FLOAT DEFAULT 0",
            "fetch_status": "VARCHAR(100) DEFAULT 'fetched'",
            "editor_notes": "TEXT",
        },
        "generated_content": {
            "platform": "VARCHAR(100) DEFAULT 'blog'",
            "hashtags": "TEXT",
            "photography_direction": "TEXT",
            "source_url": "VARCHAR(1000)",
            "suggested_post_time": "VARCHAR(100)",
            "scheduled_publish_time": "DATETIME",
            "validation_status": "VARCHAR(100) DEFAULT 'not_checked'",
            "validation_score": "FLOAT DEFAULT 0",
            "validation_issues": "TEXT",
            "revision_count": "INTEGER DEFAULT 0",
        },
        "publish_logs": {
            "scheduled_publish_time": "DATETIME",
        },
    }

    with engine.begin() as connection:
        for table_name, columns in table_columns.items():
            existing_columns = {
                row[1]
                for row in connection.execute(
                    text(f"PRAGMA table_info({table_name})")
                )
            }

            for column_name, column_type in columns.items():
                if column_name in existing_columns:
                    continue

                connection.execute(
                    text(
                        f"ALTER TABLE {table_name} "
                        f"ADD COLUMN {column_name} {column_type}"
                    )
                )
