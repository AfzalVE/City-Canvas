from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Feed
from app.services.rss_service import RSSService


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

    return {
        "message": "RSS fetched successfully",
        "result": result
    }


# ======================================================
# ALL FEEDS
# ======================================================

@router.get("/")
def get_all_feeds(
    db: Session = Depends(get_db)
):

    feeds = (

        db.query(Feed)

        .order_by(
            Feed.created_at.desc()
        )

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

    db.commit()

    db.refresh(feed)

    return {
        "message": "Feed approved",
        "feed": feed
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
