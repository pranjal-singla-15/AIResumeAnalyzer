from pydantic import BaseModel

class Job(BaseModel):
    title: str
    company: str
    description: str

class JobMatchRequest(BaseModel):
    resumeSkills: list[str]
    jobs: list[Job]