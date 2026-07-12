package com.pranjal.AIResumeAnalyzer.service;

import com.pranjal.AIResumeAnalyzer.dto.ResumeAnalysisResponse;
import com.pranjal.AIResumeAnalyzer.dto.ResumeSummaryDto;
import com.pranjal.AIResumeAnalyzer.entity.Resume;
import com.pranjal.AIResumeAnalyzer.entity.User;
import com.pranjal.AIResumeAnalyzer.repository.ResumeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AuthService authService;
    private final PdfExtractionService pdfExtractionService;
    @Autowired
    public AiAnalysisService aiAnalysisService;

    @Transactional
    public Resume uploadResume(MultipartFile file) throws IOException {

        validateFile(file);

        String savedPath = saveResumeFile(file);

        String extractedText =
                pdfExtractionService.extractText(savedPath);

        User currentUser =
                authService.getCurrentUser();

        Resume resume = new Resume();

        resume.setFileUrl(savedPath);
        resume.setExtractedText(extractedText);
        resume.setUser(currentUser);
        resume.setCreatedAt(LocalDateTime.now());

        return resumeRepository.save(resume);
    }

    @Transactional
    public void deleteResume(Long resumeId) throws IOException {

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException("Resume not found"));

        User currentUser =
                authService.getCurrentUser();

        if (!resume.getUser().getId()
                .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not authorized to delete this resume"
            );
        }

        Path filePath =
                Paths.get(resume.getFileUrl());

        Files.deleteIfExists(filePath);

        resumeRepository.delete(resume);
    }

    public List<ResumeSummaryDto> getUserResumes() {
        User currentUser = authService.getCurrentUser();
        List<Resume> resumes = resumeRepository.findByUserOrderByIdDesc(currentUser);

        return resumes.stream().map(r -> new ResumeSummaryDto(
                r.getId(),
                Paths.get(r.getFileUrl()).getFileName().toString(),
                r.getAtsScore(),
                r.getCreatedAt()
        )).collect(Collectors.toList());
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Please upload a valid PDF file"
            );
        }

        if (!"application/pdf".equals(
                file.getContentType())) {

            throw new RuntimeException(
                    "Only PDF files are allowed"
            );
        }
    }

    private String saveResumeFile(
            MultipartFile file) throws IOException {

        String uploadDir = "uploads/";

        Path uploadPath =
                Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        Path filePath =
                uploadPath.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath
        );

        return filePath.toString();
    }

    @Transactional
    public ResumeAnalysisResponse analyzeResume(Long resumeId){

        Resume resume =
                resumeRepository.findById(resumeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"
                                ));

        ResumeAnalysisResponse response =
                aiAnalysisService.analyzeResume(
                        resume.getExtractedText()
                );

        if (response.getAtsScore() != null) {
            resume.setAtsScore((int) Math.round(response.getAtsScore()));
        }
        if (response.getStrengths() != null) {
            resume.setStrengths(String.join("|", response.getStrengths()));
        }
        if (response.getImprovements() != null) {
            resume.setImprovements(String.join("|", response.getImprovements()));
        }
        resumeRepository.save(resume);

        return response;
    }
}