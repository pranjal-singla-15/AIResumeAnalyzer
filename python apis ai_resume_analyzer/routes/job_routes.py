from fastapi import APIRouter
from fastapi.responses import JSONResponse

from schemas.job_match_request import JobMatchRequest
from services.gemini_service import AIService

router = APIRouter()

ai_service = AIService()

@router.post("/match-jobs")
def match_jobs(
        request: JobMatchRequest
):
    try:
        if not request.resumeSkills or len(request.resumeSkills) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "Resume skills cannot be empty"}
            )
        if not request.jobs or len(request.jobs) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "Jobs list cannot be empty"}
            )
        return ai_service.match_jobs(request)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )
    except Exception as e:
        print(f"Error matching jobs: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to match jobs: {str(e)}"}
        )