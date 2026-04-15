package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService resumeService;

    /**
     * Upload and analyze a resume PDF
     * POST /api/resume/analyze
     */
    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeResume(@RequestParam("file") MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please upload a PDF file."));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are supported."));
        }

        // 5 MB max
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size must be under 5MB."));
        }

        try {
            AnalysisResponse response = resumeService.analyzeResume(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error analyzing resume: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to analyze resume: " + e.getMessage()));
        }
    }

    /**
     * Get all past analyses (history)
     * GET /api/resume/history
     */
    @GetMapping("/history")
    public ResponseEntity<List<AnalysisResponse>> getHistory() {
        return ResponseEntity.ok(resumeService.getHistory());
    }

    /**
     * Get a specific analysis by ID
     * GET /api/resume/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resumeService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
