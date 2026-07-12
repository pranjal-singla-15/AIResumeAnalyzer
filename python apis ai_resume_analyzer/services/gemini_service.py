import os
import json

from groq import Groq

from prompts.job_matching_prompt import get_job_matching_prompt
from prompts.resume_prompt import (
    get_resume_analysis_prompt
)
from schemas.job_match_request import JobMatchRequest
from schemas.job_match_response import JobMatch

from schemas.parsed_resume import (
    ParsedResume,
    ATSBreakdown
)


class AIService:

    def __init__(self):

        self.client = Groq(
            api_key=os.getenv(
                "GROQ_API_KEY"
            )
        )

        self.model = (
            "llama-3.3-70b-versatile"
        )

    def extract_resume_data(
            self,
            resume_text: str
    ) -> ParsedResume:

        prompt = (
            get_resume_analysis_prompt(
                resume_text
            )
        )

        response = (
            self.client
            .chat
            .completions
            .create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0
            )
        )

        generated_text = (
            response
            .choices[0]
            .message
            .content
        )

        cleaned_response = (
            generated_text
            .replace(
                "```json",
                ""
            )
            .replace(
                "```",
                ""
            )
            .strip()
        )

        data = json.loads(
            cleaned_response
        )

        return ParsedResume(

            skills=data.get(
                "skills",
                []
            ),

            education=data.get(
                "education",
                []
            ),

            projects=data.get(
                "projects",
                []
            ),

            experience=data.get(
                "experience",
                []
            ),

            atsScore=data.get(
                "atsScore",
                0
            ),

            atsBreakdown=ATSBreakdown(
                structure=data[
                    "atsBreakdown"
                ].get(
                    "structure",
                    0
                ),

                skills=data[
                    "atsBreakdown"
                ].get(
                    "skills",
                    0
                ),

                projects=data[
                    "atsBreakdown"
                ].get(
                    "projects",
                    0
                ),

                experience=data[
                    "atsBreakdown"
                ].get(
                    "experience",
                    0
                ),

                keywords=data[
                    "atsBreakdown"
                ].get(
                    "keywords",
                    0
                )
            ),

            strengths=data.get(
                "strengths",
                []
            ),

            improvements=data.get(
                "improvements",
                []
            ),
            recommendedRoles = data.get(
                "recommendedRoles",
                 []
            )
        )

    def match_jobs(
            self,
            request: JobMatchRequest
    ):
        prompt = get_job_matching_prompt(
            request.resumeSkills,
            request.jobs
        )

        response = (
            self.client
            .chat
            .completions
            .create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0
            )
        )

        generated_text = (
            response
            .choices[0]
            .message
            .content
        )

        cleaned_response = (
            generated_text
            .replace(
                "```json",
                ""
            )
            .replace(
                "```",
                ""
            )
            .strip()
        )

        data = json.loads(
            cleaned_response
        )

        return [
            JobMatch(
                jobTitle=item.get(
                    "jobTitle",
                    ""
                ),
                matchPercentage=item.get(
                    "matchPercentage",
                    0
                ),
                matchedSkills=item.get(
                    "matchedSkills",
                    []
                ),
                missingSkills=item.get(
                    "missingSkills",
                    []
                ),
                summary=item.get(
                    "summary",
                    ""
                )
            )
            for item in data
        ]