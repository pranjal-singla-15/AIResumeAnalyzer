from fastapi import APIRouter

from schemas.job_match_request import JobMatchRequest
from services import gemini_service

router = APIRouter()

@router.post("/match-jobs")
def match_jobs(
        request: JobMatchRequest
):
    return gemini_service.match_jobs(request)