from schemas.response import (
    ResumeAnalysisResponse
)


class ResumeAnalysisService:

    def __init__(
            self,
            ai_service,
            ats_service
    ):

        self.ai_service = (
            ai_service
        )

        self.ats_service = (
            ats_service
        )

    def analyze(
            self,
            resume_text: str
    ):

        parsed_resume = (
            self.ai_service
            .extract_resume_data(
                resume_text
            )
        )

        ats_score = (
            self.ats_service
            .validate_score(
                parsed_resume
            )
        )

        return ResumeAnalysisResponse(

            skills=parsed_resume.skills,

            atsScore=ats_score,

            strengths=parsed_resume.strengths,

            improvements=parsed_resume.improvements,

            recommendedRoles=parsed_resume.recommendedRoles
        )