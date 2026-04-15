package com.resumeanalyzer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResponse {

    private Long id;
    private String filename;
    private Integer score;

    // Section scores
    private Integer summaryScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private Integer formattingScore;
    private Integer professionalismScore;

    // Feedback text
    private String summaryFeedback;
    private String skillsFeedback;
    private String experienceFeedback;
    private String formattingFeedback;
    private String overallFeedback;

    private LocalDateTime submittedAt;
}
