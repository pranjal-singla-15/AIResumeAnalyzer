package com.pranjal.AIResumeAnalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataDto {

    private List<JobDto> jobs;

    private String cursor;
}