def get_job_matching_prompt(
        skills,
        jobs
):

    return f"""
You are an ATS Job Matching Expert.

Resume Skills:

{skills}

Jobs:

{jobs}

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