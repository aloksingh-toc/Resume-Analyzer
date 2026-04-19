package com.resumeanalyzer.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIFeedback {

    @Min(0) @Max(100)
    private Integer score;

    @Min(0) @Max(20)
    @JsonProperty("summary_score")
    private Integer summaryScore;

    @Min(0) @Max(20)
    @JsonProperty("skills_score")
    private Integer skillsScore;

    @Min(0) @Max(30)
    @JsonProperty("experience_score")
    private Integer experienceScore;

    @Min(0) @Max(15)
    @JsonProperty("formatting_score")
    private Integer formattingScore;

    @Min(0) @Max(15)
    @JsonProperty("professionalism_score")
    private Integer professionalismScore;

    @JsonProperty("summary_feedback")
    private String summaryFeedback;

    @JsonProperty("skills_feedback")
    private String skillsFeedback;

    @JsonProperty("experience_feedback")
    private String experienceFeedback;

    @JsonProperty("formatting_feedback")
    private String formattingFeedback;

    @JsonProperty("overall_feedback")
    private String overallFeedback;
}
