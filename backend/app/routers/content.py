from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import GeneratedContent
from app.schemas import ContentApprovalRequest
from app.schemas import ContentGenerateRequest
from app.schemas import ContentRejectionRequest
from app.services.content_service import ContentService


router = APIRouter(
    prefix="/content",
    tags=["Content Agent"]
)


@router.post("/generate")
def generate_content(
    payload: ContentGenerateRequest = ContentGenerateRequest(),
    db: Session = Depends(get_db)
):

    result = ContentService.generate(db, feed_ids=payload.feed_ids)

    return {
        "message": "Content generation completed",
        "result": result,
    }


@router.get("/")
def list_content(
    status: str | None = None,
    platform: str | None = None,
    db: Session = Depends(get_db)
):

    query = db.query(GeneratedContent)

    if status:
        query = query.filter(GeneratedContent.status == status)

    if platform:
        query = query.filter(GeneratedContent.platform == platform)

    return query.order_by(GeneratedContent.created_at.desc()).all()


@router.put("/{content_id}/approve")
def approve_content(
    content_id: int,
    payload: ContentApprovalRequest = ContentApprovalRequest(),
    db: Session = Depends(get_db)
):

    try:
        content = ContentService.approve(
            db,
            content_id,
            payload.approved_by,
            payload.scheduled_publish_time
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return content


@router.put("/{content_id}/reject")
def reject_content(
    content_id: int,
    payload: ContentRejectionRequest = ContentRejectionRequest(),
    db: Session = Depends(get_db)
):

    content = ContentService.reject(db, content_id, payload.reason)

    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    return content
