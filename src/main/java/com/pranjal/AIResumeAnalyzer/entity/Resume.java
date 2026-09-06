package com.pranjal.AIResumeAnalyzer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "resumes")
@AllArgsConstructor
@NoArgsConstructor
public class Resume {

    @Id @GeneratedValue
    private Long id;

    private String fileUrl;

    private String originalFileName;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    private Integer atsScore;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String improvements;

    private LocalDateTime createdAt;

    @ManyToOne
    private User user;
}
