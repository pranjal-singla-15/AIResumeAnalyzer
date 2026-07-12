package com.pranjal.AIResumeAnalyzer.repository;

import com.pranjal.AIResumeAnalyzer.entity.Resume;
import com.pranjal.AIResumeAnalyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByIdDesc(User user);
}
