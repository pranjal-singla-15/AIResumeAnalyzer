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
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY environment variable is not set")
        
        self.client = Groq(
            api_key=api_key
        )

        self.model = (
            "openai/gpt-oss-120b"
        )

    def extract_resume_data(
            self,
            resume_text: str
    ) -> ParsedResume:
        try:
            if not resume_text or resume_text.strip() == "":
                raise ValueError("Resume text cannot be empty")

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

            def _flatten(value):
                if isinstance(value, (list, tuple)):
                    return ", ".join(_flatten(v) for v in value if v not in (None, ""))
                return str(value)

            def _to_str_list(items):
                result = []
                for item in items or []:
                    if isinstance(item, str):
                        result.append(item)
                    elif isinstance(item, dict):
                        result.append(
                            ", ".join(
                                _flatten(v) for v in item.values() if v not in (None, "", [])
                            )
                        )
                    else:
                        result.append(_flatten(item))
                return result

            return ParsedResume(

                skills=data.get(
                    "skills",
                    []
                ),

                education=_to_str_list(data.get(
                    "education",
                    []
                )),

                projects=_to_str_list(data.get(
                    "projects",
                    []
                )),

                experience=_to_str_list(data.get(
                    "experience",
                    []
                )),

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
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except KeyError as e:
            raise ValueError(f"Missing required field in AI response: {str(e)}")
        except Exception as e:
            raise Exception(f"Error extracting resume data: {str(e)}")

    def match_jobs(
            self,
            request: JobMatchRequest
    ):
        try:
            if not request.resumeSkills or len(request.resumeSkills) == 0:
                raise ValueError("Resume skills cannot be empty")
            if not request.jobs or len(request.jobs) == 0:
                raise ValueError("Jobs list cannot be empty")

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
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except KeyError as e:
            raise ValueError(f"Missing required field in AI response: {str(e)}")
        except Exception as e:
            raise Exception(f"Error matching jobs: {str(e)}")