package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobMatchJobPayload {
    private String title;
    private String company;
    private String description;
}
