package com.resumeanalyzer.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIFeedback {

    @Min(0) @Max(100)
    private Integer score;

    // ── Section scores ──────────────────────────────────────────────────────
    @Min(0) @Max(20)  @JsonProperty("summary_score")        private Integer summaryScore;
    @Min(0) @Max(20)  @JsonProperty("skills_score")         private Integer skillsScore;
    @Min(0) @Max(30)  @JsonProperty("experience_score")     private Integer experienceScore;
    @Min(0) @Max(15)  @JsonProperty("formatting_score")     private Integer formattingScore;
    @Min(0) @Max(15)  @JsonProperty("professionalism_score")private Integer professionalismScore;

    // ── Feedback text ───────────────────────────────────────────────────────
    @JsonProperty("summary_feedback")     private String summaryFeedback;
    @JsonProperty("skills_feedback")      private String skillsFeedback;
    @JsonProperty("experience_feedback")  private String experienceFeedback;
    @JsonProperty("formatting_feedback")  private String formattingFeedback;
    @JsonProperty("overall_feedback")     private String overallFeedback;

    // ── ATS & keywords (Rec #2, #6, #8) ────────────────────────────────────
    @Min(0) @Max(100)
    @JsonProperty("ats_score")            private Integer atsScore;
    @JsonProperty("ats_issues")           private List<String> atsIssues;
    @JsonProperty("keywords_found")       private List<String> keywordsFound;
    @JsonProperty("keywords_missing")     private List<String> keywordsMissing;
    @JsonProperty("missing_sections")     private List<String> missingSections;

    // ── JD matching (Rec #1) ────────────────────────────────────────────────
    @Min(0) @Max(100)
    @JsonProperty("jd_match_score")       private Integer jdMatchScore;
}
