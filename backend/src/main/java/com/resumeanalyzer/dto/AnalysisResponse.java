package com.resumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResponse {

    private Long id;
    private String filename;
    private Integer score;

    // ── Section scores ──────────────────────────────────────────────────────
    private Integer summaryScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private Integer formattingScore;
    private Integer professionalismScore;

    // ── Feedback text ───────────────────────────────────────────────────────
    private String summaryFeedback;
    private String skillsFeedback;
    private String experienceFeedback;
    private String formattingFeedback;
    private String overallFeedback;

    // ── ATS & keyword intelligence (Rec #2, #6, #8) ─────────────────────────
    private Integer atsScore;
    private List<String> atsIssues;
    private List<String> keywordsFound;
    private List<String> keywordsMissing;
    private List<String> missingSections;

    // ── JD matching (Rec #1) ────────────────────────────────────────────────
    private Integer jdMatchScore;

    // ── Context ─────────────────────────────────────────────────────────────
    private String industry;
    private LocalDateTime submittedAt;
}
