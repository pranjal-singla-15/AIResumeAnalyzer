package com.pranjal.AIResumeAnalyzer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {

    @JsonProperty("job_id")
    private String jobId;

    @JsonProperty("job_title")
    private String title;

    @JsonProperty("employer_name")
    private String company;

    @JsonProperty("job_location")
    private String location;

    @JsonProperty("job_employment_type")
    private String employmentType;

    @JsonProperty("job_apply_link")
    private String applyLink;

    @JsonProperty("employer_logo")
    private String companyLogo;

    @JsonProperty("job_description")
    private String description;

    @JsonProperty("job_posted_at")
    private String postedAt;

}