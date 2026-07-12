def get_resume_analysis_prompt(
resume_text: str
):
    return f"""
You are an expert ATS Resume Evaluator and Career Advisor.

Analyze the resume and return ONLY valid JSON.

Evaluate the resume using the following scoring rubric:

Structure and Formatting (20 points)

* Clear sections
* Professional layout
* Readability

Technical Skills (25 points)

* Relevant technologies
* Skill diversity
* Modern tools/frameworks

Projects (25 points)

* Quality of projects
* Technical complexity
* Impact and achievements

Experience (15 points)

* Internships
* Work experience
* Leadership

Keyword Optimization (15 points)

* ATS-friendly keywords
* Industry terminology

Also recommend exactly 5 suitable job roles based on the candidate's profile.

Return JSON in the following format:

{{
"skills": [],
"education": [],
"projects": [],
"experience": [],

```
"atsBreakdown": {{
    "structure": 0,
    "skills": 0,
    "projects": 0,
    "experience": 0,
    "keywords": 0
}},

"atsScore": 0,

"strengths": [],

"improvements": [],

"recommendedRoles": []
```

}}

Rules:

1. Return ONLY valid JSON.
2. Do not include markdown.
3. Do not wrap the response inside ```json blocks.
4. atsScore must equal the sum of all atsBreakdown values.
5. atsScore must be between 0 and 100.
6. strengths should be specific and resume-based.
7. improvements should be actionable and practical.
8. recommendedRoles must contain exactly 5 roles.
9. skills should contain only technical skills.
10. education should contain education details found in the resume.
11. projects should contain project names or short project descriptions.
12. experience should contain internships, work experience, leadership positions, or responsibilities.

Resume:

{resume_text}
"""
