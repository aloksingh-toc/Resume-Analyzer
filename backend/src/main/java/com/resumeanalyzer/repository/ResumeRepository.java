package com.resumeanalyzer.repository;

import com.resumeanalyzer.model.ResumeAnalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeAnalysis, Long> {

    Page<ResumeAnalysis> findAllByOrderBySubmittedAtDesc(Pageable pageable);
}
