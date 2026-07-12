class ATSService:

    def validate_score(
            self,
            parsed_resume
    ) -> int:

        score = (
            parsed_resume
            .atsBreakdown
            .structure +

            parsed_resume
            .atsBreakdown
            .skills +

            parsed_resume
            .atsBreakdown
            .projects +

            parsed_resume
            .atsBreakdown
            .experience +

            parsed_resume
            .atsBreakdown
            .keywords
        )

        return min(
            score,
            100
        )