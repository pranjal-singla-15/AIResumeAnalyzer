package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {

    private String jobId;

    private String title;

    private String company;

    private String location;

    private String employmentType;

    private String applyLink;

    private String companyLogo;

    private String description;

    private String postedAt;

}