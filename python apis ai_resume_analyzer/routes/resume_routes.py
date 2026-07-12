from fastapi import APIRouter

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
    return analysis_service.analyze(
        request.resumeText
    )