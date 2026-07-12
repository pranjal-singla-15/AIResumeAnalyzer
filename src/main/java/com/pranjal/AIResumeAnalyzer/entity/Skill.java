package com.pranjal.AIResumeAnalyzer.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Skill {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @ManyToOne
    private Resume resume;
}
