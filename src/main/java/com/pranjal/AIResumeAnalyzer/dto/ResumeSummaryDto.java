package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeSummaryDto {
    private Long id;
    private String fileName;
    private Integer atsScore;
    private LocalDateTime createdAt;
}
