class SkillService:

    KNOWN_SKILLS = [
        "Java",
        "Spring Boot",
        "React",
        "Docker",
        "PostgreSQL",
        "Python",
        "AWS",
        "Kubernetes"
    ]

    def extract_skills(self, text: str):

        found_skills = []

        for skill in self.KNOWN_SKILLS:
            if skill.lower() in text.lower():
                found_skills.append(skill)

        return found_skills