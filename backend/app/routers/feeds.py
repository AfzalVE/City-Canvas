from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Feed
from app.schemas import FeedApprovalRequest
from app.services.rss_service import RSSService
from app.services.scoring_service import ScoringService
from app.services.content_service import ContentService
from app.services.brand_validation_service import BrandValidationService


router = APIRouter(
    prefix="/rss-feeds",
    tags=["RSS Feeds"]
)


# ======================================================
# FETCH RSS
# ======================================================

@router.post("/fetch")
def fetch_rss_feeds(
    db: Session = Depends(get_db)
):

    result = RSSService.fetch_all(db)
    inserted = int(result.get("inserted", 0))

    if inserted > 0:
        scoring = ScoringService.run(
            db,
            limit=min(inserted, 15),
            only_unscored=True
        )
    else:
        scoring = {
            "scored": 0,
            "shortlisted": []
        }

    result["scoring"] = scoring

    return {
        "message": "RSS fetched successfully",
        "result": result
    }


# ======================================================
# ALL FEEDS
# ======================================================

@router.get("/")
def get_all_feeds(
    city: str | None = None,
    status: str | None = None,
    limit: int = 15,
    db: Session = Depends(get_db)
):

    query = db.query(Feed)

    if city:
        query = query.filter(Feed.city == city)

    if status:
        query = query.filter(Feed.approval_status == status)

    if limit < 1:
        limit = 15

    limit = min(limit, 100)

    feeds = (
        query
        .order_by(
            Feed.relevance_score.desc(),
            Feed.created_at.desc()
        )
        .limit(limit)
        .all()

    )

    return feeds


# ======================================================
# FEED DETAILS
# ======================================================

@router.get("/{feed_id}")
def get_feed_by_id(
    feed_id: int,
    db: Session = Depends(get_db)
):

    feed = (

        db.query(Feed)

        .filter(
            Feed.id == feed_id
        )

        .first()

    )

    if not feed:

        raise HTTPException(
            status_code=404,
            detail="Feed not found"
        )

    return feed


# ======================================================
# PENDING FEEDS
# ======================================================

@router.get("/status/pending")
def get_pending_feeds(
    db: Session = Depends(get_db)
):

    return (

        db.query(Feed)

        .filter(
            Feed.approval_status == "pending"
        )

        .order_by(
            Feed.created_at.desc()
        )

        .all()

    )


# ======================================================
# APPROVED FEEDS
# ======================================================

@router.get("/status/approved")
def get_approved_feeds(
    db: Session = Depends(get_db)
):

    return (

        db.query(Feed)

        .filter(
            Feed.approval_status == "approved"
        )

        .order_by(
            Feed.created_at.desc()
        )

        .all()

    )


# ======================================================
# REJECTED FEEDS
# ======================================================

@router.get("/status/rejected")
def get_rejected_feeds(
    db: Session = Depends(get_db)
):

    return (

        db.query(Feed)

        .filter(
            Feed.approval_status == "rejected"
        )

        .order_by(
            Feed.created_at.desc()
        )

        .all()

    )


# ======================================================
# CITY FILTER
# ======================================================

@router.get("/city/{city}")
def get_city_feeds(
    city: str,
    db: Session = Depends(get_db)
):

    feeds = (

        db.query(Feed)

        .filter(
            Feed.city.ilike(city)
        )

        .order_by(
            Feed.created_at.desc()
        )

        .all()

    )

    return feeds


# ======================================================
# SOURCE FILTER
# ======================================================

@router.get("/source/{source_name}")
def get_source_feeds(
    source_name: str,
    db: Session = Depends(get_db)
):

    feeds = (

        db.query(Feed)

        .filter(
            Feed.source_name.ilike(
                f"%{source_name}%"
            )
        )

        .order_by(
            Feed.created_at.desc()
        )

        .all()

    )

    return feeds


# ======================================================
# APPROVE
# ======================================================

@router.put("/{feed_id}/approve")
def approve_feed(
    feed_id: int,
    payload: FeedApprovalRequest = FeedApprovalRequest(),
    db: Session = Depends(get_db)
):

    feed = (

        db.query(Feed)

        .filter(
            Feed.id == feed_id
        )

        .first()

    )

    if not feed:

        raise HTTPException(
            status_code=404,
            detail="Feed not found"
        )

    feed.approval_status = "approved"
    feed.approved_by = payload.approved_by

    if payload.editor_notes:
        feed.editor_notes = payload.editor_notes

    db.commit()

    db.refresh(feed)

    generation = ContentService.generate(
        db,
        feed_ids=[feed.id]
    )
    created_ids = generation.get("created", [])

    validation = {
        "validated": 0,
        "results": []
    }

    if created_ids:
        validation = BrandValidationService.run(
            db,
            content_ids=created_ids
        )

    return {
        "message": "Feed approved",
        "feed": feed,
        "content_generation": generation,
        "brand_validation": validation,
    }


# ======================================================
# REJECT
# ======================================================

@router.put("/{feed_id}/reject")
def reject_feed(
    feed_id: int,
    reason: str = "",
    db: Session = Depends(get_db)
):

    feed = (

        db.query(Feed)

        .filter(
            Feed.id == feed_id
        )

        .first()

    )

    if not feed:

        raise HTTPException(
            status_code=404,
            detail="Feed not found"
        )

    feed.approval_status = "rejected"

    feed.rejection_reason = reason

    db.commit()

    db.refresh(feed)

    return {
        "message": "Feed rejected",
        "feed": feed
    }
