package com.resumeanalyzer.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIFeedback {

    private Integer score;

    // Individual section scores
    private Integer summary_score;
    private Integer skills_score;
    private Integer experience_score;
    private Integer formatting_score;
    private Integer professionalism_score;

    // Feedback text
    private String summary_feedback;
    private String skills_feedback;
    private String experience_feedback;
    private String formatting_feedback;
    private String overall_feedback;
}
