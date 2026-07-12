package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeAnalysisResponse {

    private List<String> skills;
    private Double atsScore;
    private List<String> strengths;
    private List<String> improvements;
    private List<String> recommendedRoles;
}