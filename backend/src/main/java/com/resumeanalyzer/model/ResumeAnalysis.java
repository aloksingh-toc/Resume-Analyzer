package com.resumeanalyzer.model;

import com.resumeanalyzer.config.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "resume_analysis")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // null for anonymous analyses (pre-user-scoping or guest uploads)
    @Column(length = 150)
    private String username;

    @Column(nullable = false, length = 500)
    private String filename;

    @Column(nullable = false)
    private Integer score;

    // ── Section scores ──────────────────────────────────────────────────────
    @Column private Integer summaryScore;
    @Column private Integer skillsScore;
    @Column private Integer experienceScore;
    @Column private Integer formattingScore;
    @Column private Integer professionalismScore;

    // ── Feedback text ───────────────────────────────────────────────────────
    @Column(columnDefinition = "TEXT") private String summaryFeedback;
    @Column(columnDefinition = "TEXT") private String skillsFeedback;
    @Column(columnDefinition = "TEXT") private String experienceFeedback;
    @Column(columnDefinition = "TEXT") private String formattingFeedback;
    @Column(columnDefinition = "TEXT") private String overallFeedback;

    // ── ATS & keyword intelligence (Rec #2, #6, #8) ─────────────────────────
    /** 0–100 ATS compatibility score */
    @Column private Integer atsScore;

    /** ATS-specific issues found in the resume */
    @Column(columnDefinition = "TEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> atsIssues;

    /** Important keywords PRESENT in the resume */
    @Column(columnDefinition = "TEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> keywordsFound;

    /** Important keywords MISSING from the resume */
    @Column(columnDefinition = "TEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> keywordsMissing;

    /** Sections missing from the resume (e.g. "Education", "Certifications") */
    @Column(columnDefinition = "TEXT")
    @Convert(converter = StringListConverter.class)
    private List<String> missingSections;

    // ── Job Description matching (Rec #1) ───────────────────────────────────
    /** 0–100 match % vs job description; null when no JD was provided */
    @Column private Integer jdMatchScore;

    // ── Industry / role context (Rec #5) ────────────────────────────────────
    @Column(length = 100) private String industry;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
