package com.pranjal.AIResumeAnalyzer.controller;

import com.pranjal.AIResumeAnalyzer.dto.*;
import com.pranjal.AIResumeAnalyzer.service.AiAnalysisService;
import com.pranjal.AIResumeAnalyzer.service.JobSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    @Autowired
    private JobSearchService jobSearchService;

    @Autowired
    private AiAnalysisService aiAnalysisService;

    @Autowired
    private com.pranjal.AIResumeAnalyzer.service.ResumeService resumeService;

    @GetMapping("/search")
    public ResponseEntity<SearchJobsWithMatchResponse> searchJobs(
            @RequestParam String query
    ){
        try {
            // Try to fetch the user's most recent resume and analyze it to get skills
            var resumes = resumeService.getUserResumes();
            if (resumes != null && !resumes.isEmpty()) {
                Long resumeId = resumes.get(0).getId();
                var analysis = resumeService.analyzeResume(resumeId);
                var skills = analysis != null ? analysis.getSkills() : null;
                SearchJobsWithMatchResponse res = jobSearchService.searchJobsWithMatch(query, skills);
                return ResponseEntity.ok(res);
            } else {
                // No resumes for user - return jobs without match info
                SearchJobsWithMatchResponse res = jobSearchService.searchJobsWithMatch(query, null);
                return ResponseEntity.ok(res);
            }
        } catch (Exception e) {
            // On any error, fall back to returning jobs without match info
            System.err.println("Error during search + match: " + e.getMessage());
            SearchJobsWithMatchResponse res = jobSearchService.searchJobsWithMatch(query, null);
            return ResponseEntity.ok(res);
        }
    }

    @PostMapping("/search-with-match")
    public ResponseEntity<SearchJobsWithMatchResponse> searchJobsWithMatch(
            @RequestBody SearchJobsWithSkillsRequest request
    ){
        SearchJobsWithMatchResponse res = jobSearchService.searchJobsWithMatch(
                request.getQuery(),
                request.getResumeSkills()
        );
        return ResponseEntity.ok(res);
    }

    @PostMapping("/match")
    public ResponseEntity<List<JobMatchResponse>> matchJobs(
            @RequestBody JobMatchRequest request){

        return ResponseEntity.ok(
                aiAnalysisService.matchJobs(request)
        );
    }

}