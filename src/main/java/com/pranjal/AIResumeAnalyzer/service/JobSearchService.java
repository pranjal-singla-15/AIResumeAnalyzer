package com.pranjal.AIResumeAnalyzer.service;

import com.pranjal.AIResumeAnalyzer.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class JobSearchService {

    @Autowired
    public RestTemplate restTemplate;

    @Autowired
    private AiAnalysisService aiAnalysisService;

    @Value("${rapidapi.key}")
    private String apiKey;

    @Value("${rapidapi.host}")
    private String apiHost;

    public JobSearchResponse searchJobs(String query) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", apiKey);
        headers.set("x-rapidapi-host", apiHost);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url =
                "https://jsearch.p.rapidapi.com/search-v2?" +
                        "query=" + URLEncoder.encode(query, StandardCharsets.UTF_8) +
                        "&num_pages=1";

        ResponseEntity<JobSearchResponse> response =
                restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        JobSearchResponse.class
                );

        return response.getBody();

    }

    public SearchJobsWithMatchResponse searchJobsWithMatch(String query, List<String> resumeSkills) {
        // Get jobs from API
        JobSearchResponse searchResponse = searchJobs(query);
        List<JobDto> jobList =

                searchResponse != null &&
                        searchResponse.getData() != null

                        ? searchResponse.getData().getJobs()

                        : new ArrayList<>();

        SearchJobsWithMatchResponse response = new SearchJobsWithMatchResponse();
        response.setHasMatches(false);

        if (jobList.isEmpty()) {
            response.setJobsWithMatch(new ArrayList<>());
            return response;
        }

        // If skills are provided, match jobs
        List<JobWithMatchDto> jobsWithMatch = new ArrayList<>();

        if (resumeSkills != null && !resumeSkills.isEmpty()) {
            try {
                // Get matches from AI service
                List<JobMatchJobPayload> jobPayloads = new ArrayList<>();
                for (JobDto job : jobList) {
                    jobPayloads.add(new JobMatchJobPayload(
                            job.getTitle(),
                            job.getCompany(),
                            job.getDescription()
                    ));
                }

                JobMatchRequest matchRequest = new JobMatchRequest();
                matchRequest.setResumeSkills(resumeSkills);
                matchRequest.setJobs(jobPayloads);

                List<JobMatchResponse> matches = aiAnalysisService.matchJobs(matchRequest);

                // Combine jobs with their match data
                for (int i = 0; i < jobList.size(); i++) {
                    JobWithMatchDto jobWithMatch = new JobWithMatchDto();
                    JobDto job = jobList.get(i);

                    // Copy job details
                    jobWithMatch.setJobId(job.getJobId());
                    jobWithMatch.setTitle(job.getTitle());
                    jobWithMatch.setCompany(job.getCompany());
                    jobWithMatch.setLocation(job.getLocation());
                    jobWithMatch.setEmploymentType(job.getEmploymentType());
                    jobWithMatch.setApplyLink(job.getApplyLink());
                    jobWithMatch.setCompanyLogo(job.getCompanyLogo());
                    jobWithMatch.setDescription(job.getDescription());
                    jobWithMatch.setPostedAt(job.getPostedAt());

                    // Add match data if available
                    if (i < matches.size()) {
                        JobMatchResponse match = matches.get(i);
                        jobWithMatch.setMatchPercentage(match.getMatchPercentage());
                        jobWithMatch.setMatchedSkills(match.getMatchedSkills());
                        jobWithMatch.setMissingSkills(match.getMissingSkills());
                        jobWithMatch.setSummary(match.getSummary());
                    }

                    jobsWithMatch.add(jobWithMatch);
                }

                response.setJobsWithMatch(jobsWithMatch);
                response.setHasMatches(true);
            } catch (Exception e) {
                // If matching fails, return jobs without match data
                System.err.println("Error matching jobs: " + e.getMessage());
                jobsWithMatch = convertJobsToJobsWithMatch(jobList);
                response.setJobsWithMatch(jobsWithMatch);
                response.setHasMatches(false);
            }
        } else {
            // No skills provided, return jobs without match data
            jobsWithMatch = convertJobsToJobsWithMatch(jobList);
            response.setJobsWithMatch(jobsWithMatch);
        }

        return response;
    }

    private List<JobWithMatchDto> convertJobsToJobsWithMatch(List<JobDto> jobs) {
        List<JobWithMatchDto> result = new ArrayList<>();
        for (JobDto job : jobs) {
            JobWithMatchDto jobWithMatch = new JobWithMatchDto();
            jobWithMatch.setJobId(job.getJobId());
            jobWithMatch.setTitle(job.getTitle());
            jobWithMatch.setCompany(job.getCompany());
            jobWithMatch.setLocation(job.getLocation());
            jobWithMatch.setEmploymentType(job.getEmploymentType());
            jobWithMatch.setApplyLink(job.getApplyLink());
            jobWithMatch.setCompanyLogo(job.getCompanyLogo());
            jobWithMatch.setDescription(job.getDescription());
            jobWithMatch.setPostedAt(job.getPostedAt());
            result.add(jobWithMatch);
        }
        return result;
    }
}
