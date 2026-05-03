package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AIFeedback;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.model.ResumeAnalysis;
import org.springframework.stereotype.Component;

/**
 * Single place responsible for mapping between AIFeedback / ResumeAnalysis / AnalysisResponse.
 * Adding a new AI field only requires a change here + in the three DTOs — nowhere else.
 */
@Component
public class ResumeAnalysisMapper {

    /** Build a persistable entity from raw AI output and submission metadata. */
    public ResumeAnalysis toEntity(AIFeedback f, String filename, String username,
                                   String industry) {
        return ResumeAnalysis.builder()
            .username(username)
            .filename(filename)
            .score(f.getScore())
            .summaryScore(f.getSummaryScore())
            .skillsScore(f.getSkillsScore())
            .experienceScore(f.getExperienceScore())
            .formattingScore(f.getFormattingScore())
            .professionalismScore(f.getProfessionalismScore())
            .summaryFeedback(f.getSummaryFeedback())
            .skillsFeedback(f.getSkillsFeedback())
            .experienceFeedback(f.getExperienceFeedback())
            .formattingFeedback(f.getFormattingFeedback())
            .overallFeedback(f.getOverallFeedback())
            .atsScore(f.getAtsScore())
            .atsIssues(f.getAtsIssues())
            .keywordsFound(f.getKeywordsFound())
            .keywordsMissing(f.getKeywordsMissing())
            .missingSections(f.getMissingSections())
            .jdMatchScore(f.getJdMatchScore())
            .industry(industry != null && !industry.isBlank() ? industry : null)
            .build();
    }

    /** Convert a persisted entity to the API response DTO. */
    public AnalysisResponse toResponse(ResumeAnalysis a) {
        return AnalysisResponse.builder()
            .id(a.getId())
            .filename(a.getFilename())
            .score(a.getScore())
            .summaryScore(a.getSummaryScore())
            .skillsScore(a.getSkillsScore())
            .experienceScore(a.getExperienceScore())
            .formattingScore(a.getFormattingScore())
            .professionalismScore(a.getProfessionalismScore())
            .summaryFeedback(a.getSummaryFeedback())
            .skillsFeedback(a.getSkillsFeedback())
            .experienceFeedback(a.getExperienceFeedback())
            .formattingFeedback(a.getFormattingFeedback())
            .overallFeedback(a.getOverallFeedback())
            .atsScore(a.getAtsScore())
            .atsIssues(a.getAtsIssues())
            .keywordsFound(a.getKeywordsFound())
            .keywordsMissing(a.getKeywordsMissing())
            .missingSections(a.getMissingSections())
            .jdMatchScore(a.getJdMatchScore())
            .industry(a.getIndustry())
            .submittedAt(a.getSubmittedAt())
            .build();
    }
}
