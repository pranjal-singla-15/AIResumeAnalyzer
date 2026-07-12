from pydantic import BaseModel
from typing import List

class ResumeAnalysisResponse(BaseModel):
    skills: List[str]
    atsScore: float
    strengths: List[str]
    improvements: List[str]
    recommendedRoles: List[str]