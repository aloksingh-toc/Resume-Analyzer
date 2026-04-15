package com.resumeanalyzer.repository;

import com.resumeanalyzer.model.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeAnalysis, Long> {

    List<ResumeAnalysis> findAllByOrderBySubmittedAtDesc();
}
