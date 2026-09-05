from fastapi import APIRouter
from fastapi.responses import JSONResponse

from schemas.request import ResumeAnalysisRequest
from schemas.response import ResumeAnalysisResponse
from services.ats_service import ATSService
from services.gemini_service import AIService
from services.resume_analysis_service import ResumeAnalysisService

router = APIRouter()

analysis_service = ResumeAnalysisService(
    AIService(),
    ATSService()
)

@router.post(
    "/analyze-resume",
    response_model=ResumeAnalysisResponse
)
def analyze_resume(
        request: ResumeAnalysisRequest
):
    try:
        if not request.resumeText or request.resumeText.strip() == "":
            return JSONResponse(
                status_code=400,
                content={"error": "Resume text cannot be empty"}
            )
        return analysis_service.analyze(
            request.resumeText
        )
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )
    except Exception as e:
        print(f"Error analyzing resume: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to analyze resume: {str(e)}"}
        )