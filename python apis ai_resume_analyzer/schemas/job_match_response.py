from pydantic import BaseModel

class JobMatch(BaseModel):
    jobTitle: str
    matchPercentage: int
    matchedSkills: list[str]
    missingSkills: list[str]
    summary: str