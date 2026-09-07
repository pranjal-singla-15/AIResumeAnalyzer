package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchJobsWithMatchResponse {
    private List<JobWithMatchDto> jobsWithMatch;
    private Boolean hasMatches;
}


