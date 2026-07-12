package com.pranjal.AIResumeAnalyzer.controller;


import com.pranjal.AIResumeAnalyzer.dto.ResumeAnalysisResponse;
import com.pranjal.AIResumeAnalyzer.entity.Resume;
import com.pranjal.AIResumeAnalyzer.service.AiAnalysisService;
import com.pranjal.AIResumeAnalyzer.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        Resume resume = resumeService.uploadResume(file);
        Map<String, Object> body = new HashMap<>();
        body.put("id", resume.getId());
        body.put("message", "Resume uploaded successfully");
        return ResponseEntity.ok(body);
    }

    @GetMapping
    public ResponseEntity<?> listResumes() {
        return ResponseEntity.ok(resumeService.getUserResumes());
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<?> deleteResume(
            @PathVariable Long resumeId) throws IOException {

        resumeService.deleteResume(resumeId);

        return ResponseEntity.ok("Resume deleted successfully");
    }

    @Autowired
    private AiAnalysisService aiAnalysisService;

    @GetMapping("/test-ai")
    public ResponseEntity<?> testAI() {

        ResumeAnalysisResponse response =
                aiAnalysisService.analyzeResume(
                        "Java Spring Boot Docker PostgreSQL"
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{resumeId}/analyze")
    public ResponseEntity<?> analyzeResume(
            @PathVariable Long resumeId){

        ResumeAnalysisResponse response = resumeService.analyzeResume(resumeId);

        return ResponseEntity.ok(response);
    }
}
