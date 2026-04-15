package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AIFeedback;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.model.ResumeAnalysis;
import com.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final AIService aiService;
    private final ResumeRepository resumeRepository;

    public AnalysisResponse analyzeResume(MultipartFile file) throws Exception {
        log.info("Analyzing resume: {}", file.getOriginalFilename());

        // Extract text from PDF
        String resumeText = extractTextFromPDF(file);

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new RuntimeException("Could not extract text from the uploaded PDF. Please ensure the PDF is not scanned or image-based.");
        }

        log.info("Extracted {} characters from PDF", resumeText.length());

        // Call OpenAI API
        AIFeedback feedback = aiService.analyzeResume(resumeText);

        // Save to database
        ResumeAnalysis analysis = ResumeAnalysis.builder()
            .filename(file.getOriginalFilename())
            .score(feedback.getScore())
            .summaryScore(feedback.getSummary_score())
            .skillsScore(feedback.getSkills_score())
            .experienceScore(feedback.getExperience_score())
            .formattingScore(feedback.getFormatting_score())
            .professionalismScore(feedback.getProfessionalism_score())
            .summaryFeedback(feedback.getSummary_feedback())
            .skillsFeedback(feedback.getSkills_feedback())
            .experienceFeedback(feedback.getExperience_feedback())
            .formattingFeedback(feedback.getFormatting_feedback())
            .overallFeedback(feedback.getOverall_feedback())
            .build();

        ResumeAnalysis saved = resumeRepository.save(analysis);
        log.info("Saved analysis with id: {}", saved.getId());

        return toResponse(saved);
    }

    public List<AnalysisResponse> getHistory() {
        return resumeRepository.findAllByOrderBySubmittedAtDesc()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public AnalysisResponse getById(Long id) {
        ResumeAnalysis analysis = resumeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Analysis not found with id: " + id));
        return toResponse(analysis);
    }

    private String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private AnalysisResponse toResponse(ResumeAnalysis analysis) {
        return AnalysisResponse.builder()
            .id(analysis.getId())
            .filename(analysis.getFilename())
            .score(analysis.getScore())
            .summaryScore(analysis.getSummaryScore())
            .skillsScore(analysis.getSkillsScore())
            .experienceScore(analysis.getExperienceScore())
            .formattingScore(analysis.getFormattingScore())
            .professionalismScore(analysis.getProfessionalismScore())
            .summaryFeedback(analysis.getSummaryFeedback())
            .skillsFeedback(analysis.getSkillsFeedback())
            .experienceFeedback(analysis.getExperienceFeedback())
            .formattingFeedback(analysis.getFormattingFeedback())
            .overallFeedback(analysis.getOverallFeedback())
            .submittedAt(analysis.getSubmittedAt())
            .build();
    }
}
