package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.AIFeedback;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.dto.PagedResponse;
import com.resumeanalyzer.model.ResumeAnalysis;
import com.resumeanalyzer.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {

    private final AIService aiService;
    private final ResumeRepository resumeRepository;

    public AnalysisResponse analyzeResume(MultipartFile file, String username) throws Exception {
        String filename = sanitizeFilename(file.getOriginalFilename());
        log.info("Analyzing resume: {} for user: {}", filename, username != null ? username : "(guest)");

        String resumeText = extractTextFromPDF(file);

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new RuntimeException("Could not extract text from the uploaded PDF. Please ensure the PDF is not scanned or image-based.");
        }

        log.info("Extracted {} characters from PDF", resumeText.length());

        AIFeedback feedback = aiService.analyzeResume(resumeText);

        ResumeAnalysis analysis = ResumeAnalysis.builder()
            .username(username)
            .filename(filename)
            .score(feedback.getScore())
            .summaryScore(feedback.getSummaryScore())
            .skillsScore(feedback.getSkillsScore())
            .experienceScore(feedback.getExperienceScore())
            .formattingScore(feedback.getFormattingScore())
            .professionalismScore(feedback.getProfessionalismScore())
            .summaryFeedback(feedback.getSummaryFeedback())
            .skillsFeedback(feedback.getSkillsFeedback())
            .experienceFeedback(feedback.getExperienceFeedback())
            .formattingFeedback(feedback.getFormattingFeedback())
            .overallFeedback(feedback.getOverallFeedback())
            .build();

        ResumeAnalysis saved = resumeRepository.save(analysis);
        log.info("Saved analysis with id: {}", saved.getId());

        return toResponse(saved);
    }

    public PagedResponse<AnalysisResponse> getHistory(int page, int size, String username) {
        Page<ResumeAnalysis> result = resumeRepository
            .findAllByUsernameOrderBySubmittedAtDesc(username, PageRequest.of(page, Math.min(size, 50)));
        return PagedResponse.<AnalysisResponse>builder()
            .content(result.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
            .page(result.getNumber())
            .totalPages(result.getTotalPages())
            .totalElements(result.getTotalElements())
            .last(result.isLast())
            .build();
    }

    public AnalysisResponse getById(Long id) {
        return resumeRepository.findById(id)
            .map(this::toResponse)
            .orElseThrow(() -> new RuntimeException("Analysis not found."));
    }

    private String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String sanitizeFilename(String name) {
        if (name == null || name.isBlank()) return "resume.pdf";
        return name.replaceAll("[^a-zA-Z0-9._\\- ]", "").trim();
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
