package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobMatchResponse {
    private String jobTitle;
    private Integer matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String summary;
}
