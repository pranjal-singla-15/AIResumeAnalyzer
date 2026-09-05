package com.pranjal.AIResumeAnalyzer.service;

import com.pranjal.AIResumeAnalyzer.dto.JobMatchRequest;
import com.pranjal.AIResumeAnalyzer.dto.JobMatchResponse;
import com.pranjal.AIResumeAnalyzer.dto.ResumeAnalysisRequest;
import com.pranjal.AIResumeAnalyzer.dto.ResumeAnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiAnalysisService {

    private final RestTemplate restTemplate;

    @Value("${AI_SERVICE_URL:http://localhost:8000}")
    private String aiServiceUrl;

    public ResumeAnalysisResponse analyzeResume(String resumeText) {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new RuntimeException("Resume text cannot be empty");
        }

        try {
            ResumeAnalysisRequest request = new ResumeAnalysisRequest();
            request.setResumeText(resumeText);

            System.out.println("Calling AI service at: " + aiServiceUrl + "/analyze-resume");
            
            ResumeAnalysisResponse response = restTemplate.postForObject(
                    aiServiceUrl + "/analyze-resume",
                    request,
                    ResumeAnalysisResponse.class
            );

            if (response == null) {
                throw new RuntimeException("Failed to get response from AI Service");
            }

            return response;
        } catch (RestClientException e) {
            System.err.println("AI Service connection error: " + e.getMessage());
            throw new RuntimeException(
                    "Cannot connect to AI Service at " + aiServiceUrl + 
                    ". Make sure the AI service is running. Error: " + e.getMessage(),
                    e
            );
        } catch (Exception e) {
            System.err.println("Error calling AI Service: " + e.getMessage());
            throw new RuntimeException(
                    "Failed to analyze resume: " + e.getMessage(),
                    e
            );
        }
    }

    public List<JobMatchResponse> matchJobs(JobMatchRequest request) {
        if (request == null || request.getResumeSkills() == null || request.getResumeSkills().isEmpty()) {
            throw new RuntimeException("Resume skills cannot be empty");
        }

        if (request.getJobs() == null || request.getJobs().isEmpty()) {
            throw new RuntimeException("Jobs list cannot be empty");
        }

        try {
            System.out.println("Calling AI service at: " + aiServiceUrl + "/match-jobs");
            
            JobMatchResponse[] response = restTemplate.postForObject(
                    aiServiceUrl + "/match-jobs",
                    request,
                    JobMatchResponse[].class
            );

            if (response == null) {
                throw new RuntimeException("Failed to match jobs");
            }

            return Arrays.asList(response);
        } catch (RestClientException e) {
            System.err.println("AI Service connection error: " + e.getMessage());
            throw new RuntimeException(
                    "Cannot connect to AI Service at " + aiServiceUrl + 
                    ". Make sure the AI service is running. Error: " + e.getMessage(),
                    e
            );
        } catch (Exception e) {
            System.err.println("Error calling AI Service: " + e.getMessage());
            throw new RuntimeException(
                    "Failed to match jobs: " + e.getMessage(),
                    e
            );
        }
    }
}