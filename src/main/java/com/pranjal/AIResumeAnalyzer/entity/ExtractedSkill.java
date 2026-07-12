package com.pranjal.AIResumeAnalyzer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "extracted_skills")
@AllArgsConstructor
@NoArgsConstructor
public class ExtractedSkill {

    @Id
    @GeneratedValue
    private Long id;

    private String skillName;

    @ManyToOne
    private Resume resume;
}
