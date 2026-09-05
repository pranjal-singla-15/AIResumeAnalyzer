MAX_DESCRIPTION_CHARS = 500


def _format_jobs(jobs):
    lines = []
    for i, job in enumerate(jobs):
        description = job.description or ""
        if len(description) > MAX_DESCRIPTION_CHARS:
            description = description[:MAX_DESCRIPTION_CHARS].rsplit(" ", 1)[0] + "..."
        lines.append(
            f"{i + 1}. Title: {job.title} | Company: {job.company} | Description: {description}"
        )
    return "\n".join(lines)


def get_job_matching_prompt(
        skills,
        jobs
):

    return f"""
You are an ATS Job Matching Expert.

Resume Skills:

{skills}

Jobs:

{_format_jobs(jobs)}

Compare every job with the resume skills.

Return ONLY valid JSON.

[
  {{
    "jobTitle":"",
    "matchPercentage":0,
    "matchedSkills":[],
    "missingSkills":[],
    "summary":""
  }}
]

Rules

1. Match percentage must be between 0 and 100.

2. matchedSkills should contain only skills present in both resume and job.

3. missingSkills should contain important skills required by the job but absent from resume.

4. Summary should be one sentence.

Return JSON only.
"""