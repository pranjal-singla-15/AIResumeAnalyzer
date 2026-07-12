package com.pranjal.AIResumeAnalyzer.service;

import com.pranjal.AIResumeAnalyzer.dto.JobMatchRequest;
import com.pranjal.AIResumeAnalyzer.dto.JobMatchResponse;
import com.pranjal.AIResumeAnalyzer.dto.ResumeAnalysisRequest;
import com.pranjal.AIResumeAnalyzer.dto.ResumeAnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final RestTemplate restTemplate;

    private static final String AI_SERVICE_URL =
            "http://localhost:8000/analyze-resume";

    public ResumeAnalysisResponse analyzeResume(String resumeText) {

        ResumeAnalysisRequest request =
                new ResumeAnalysisRequest();

        request.setResumeText(resumeText);

        ResumeAnalysisResponse response =
                restTemplate.postForObject(
                        AI_SERVICE_URL,
                        request,
                        ResumeAnalysisResponse.class
                );

        if(response == null){
            throw new RuntimeException(
                    "Failed to get response from AI Service"
            );
        }

        return response;
    }

    private static final String JOB_MATCH_URL =
            "http://localhost:8000/match-jobs";

    public List<JobMatchResponse> matchJobs(JobMatchRequest request){

        JobMatchResponse[] response =
                restTemplate.postForObject(
                        JOB_MATCH_URL,
                        request,
                        JobMatchResponse[].class
                );

        if(response == null){
            throw new RuntimeException(
                    "Failed to match jobs"
            );
        }

        return Arrays.asList(response);
    }

}