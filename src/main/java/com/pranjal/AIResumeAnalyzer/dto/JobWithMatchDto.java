package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobWithMatchDto {
    
    private String jobId;
    private String title;
    private String company;
    private String location;
    private String employmentType;
    private String applyLink;
    private String companyLogo;
    private String description;
    private String postedAt;
    
    // Match information
    private Integer matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String summary;
    
}

