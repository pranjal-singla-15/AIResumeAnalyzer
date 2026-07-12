package com.pranjal.AIResumeAnalyzer.controller;

import com.pranjal.AIResumeAnalyzer.dto.JobMatchRequest;
import com.pranjal.AIResumeAnalyzer.dto.JobMatchResponse;
import com.pranjal.AIResumeAnalyzer.dto.JobSearchResponse;
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

    @GetMapping("/search")
    public ResponseEntity<JobSearchResponse> searchJobs(
            @RequestParam String query
    ){
        JobSearchResponse res = jobSearchService.searchJobs(query);
        return  ResponseEntity.ok(res);
    }

    @PostMapping("/match")
    public ResponseEntity<List<JobMatchResponse>> matchJobs(
            @RequestBody JobMatchRequest request){

        return ResponseEntity.ok(
                aiAnalysisService.matchJobs(request)
        );
    }

}