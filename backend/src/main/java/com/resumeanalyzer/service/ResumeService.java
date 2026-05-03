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

    private final AIService            aiService;
    private final ResumeRepository     resumeRepository;
    private final ResumeAnalysisMapper mapper;

    public AnalysisResponse analyzeResume(MultipartFile file,
                                          String username,
                                          String jobDescription,
                                          String industry) throws Exception {
        String filename   = sanitizeFilename(file.getOriginalFilename());
        String resumeText = extractText(file);

        log.info("Analyzing resume: {} | user: {} | industry: {}",
                 filename, username != null ? username : "(guest)", industry);

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException(
                "Could not extract text from the uploaded PDF. " +
                "Please ensure the PDF is not scanned or image-based.");
        }

        AIFeedback     feedback = aiService.analyzeResume(resumeText, jobDescription, industry);
        ResumeAnalysis entity   = mapper.toEntity(feedback, filename, username, industry);
        ResumeAnalysis saved    = resumeRepository.save(entity);

        log.info("Saved analysis id: {}", saved.getId());
        return mapper.toResponse(saved);
    }

    public PagedResponse<AnalysisResponse> getHistory(int page, int size, String username) {
        Page<ResumeAnalysis> result = resumeRepository
            .findAllByUsernameOrderBySubmittedAtDesc(username, PageRequest.of(page, Math.min(size, 50)));
        return PagedResponse.<AnalysisResponse>builder()
            .content(result.getContent().stream().map(mapper::toResponse).collect(Collectors.toList()))
            .page(result.getNumber())
            .totalPages(result.getTotalPages())
            .totalElements(result.getTotalElements())
            .last(result.isLast())
            .build();
    }

    public AnalysisResponse getById(Long id) {
        return resumeRepository.findById(id)
            .map(mapper::toResponse)
            .orElseThrow(() -> new RuntimeException("Analysis not found."));
    }

    public long getTotalCount() {
        return resumeRepository.count();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String extractText(MultipartFile file) throws IOException {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            return new PDFTextStripper().getText(doc);
        }
    }

    private String sanitizeFilename(String name) {
        if (name == null || name.isBlank()) return "resume.pdf";
        return name.replaceAll("[^a-zA-Z0-9._\\- ]", "").trim();
    }
}
