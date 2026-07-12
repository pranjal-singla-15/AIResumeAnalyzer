from pydantic import BaseModel

class ResumeAnalysisRequest(BaseModel):
    resumeText: str