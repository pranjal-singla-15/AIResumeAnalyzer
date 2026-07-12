from pydantic import BaseModel


class ATSBreakdown(BaseModel):
    structure: int
    skills: int
    projects: int
    experience: int
    keywords: int


class ParsedResume(BaseModel):

    skills: list[str]

    education: list[str]

    projects: list[str]

    experience: list[str]

    atsScore: int

    atsBreakdown: ATSBreakdown

    strengths: list[str]

    improvements: list[str]

    recommendedRoles: list[str]