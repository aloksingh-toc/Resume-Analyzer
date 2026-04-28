package com.resumeanalyzer.repository;

import com.resumeanalyzer.model.ResumeAnalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<ResumeAnalysis, Long> {

    /** Returns analyses for a specific user, newest first. */
    Page<ResumeAnalysis> findAllByUsernameOrderBySubmittedAtDesc(String username, Pageable pageable);

    /** Fallback: returns ALL analyses (kept for admin tooling). */
    Page<ResumeAnalysis> findAllByOrderBySubmittedAtDesc(Pageable pageable);
}
