package com.pranjal.AIResumeAnalyzer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @GeneratedValue
    @Id
    private Long id;

    private String username;

    private String password;

    @Column(unique = true)
    private String email;
}
