package com.resumeanalyzer.controller;

import com.resumeanalyzer.config.AuthUtils;
import com.resumeanalyzer.config.FreeAnalysisTracker;
import com.resumeanalyzer.config.HttpUtils;
import com.resumeanalyzer.config.ResumeFileValidator;
import com.resumeanalyzer.config.ResumeFileValidator.InvalidFileException;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.dto.PagedResponse;
import com.resumeanalyzer.service.ResumeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService        resumeService;
    private final FreeAnalysisTracker  freeAnalysisTracker;
    private final ResumeFileValidator  fileValidator;

    /** Social-proof counter — total resumes analyzed across all users. */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {
        return ResponseEntity.ok(Map.of("totalAnalyses", resumeService.getTotalCount()));
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeResume(
            @RequestParam("file")                                    MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription,
            @RequestParam(value = "industry",       required = false) String industry,
            HttpServletRequest request,
            Authentication authentication) {

        try {
            fileValidator.validate(file);
        } catch (InvalidFileException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        boolean isLoggedIn = AuthUtils.isAuthenticated(authentication);
        String  clientIp   = HttpUtils.getClientIp(request);
        String  username   = isLoggedIn ? authentication.getName() : null;

        if (!isLoggedIn && freeAnalysisTracker.hasUsedFreeAnalysis(clientIp)) {
            return ResponseEntity.status(403).body(Map.of(
                "error",         String.format("You've used your %d free analyses. Sign in for unlimited access.",
                                               FreeAnalysisTracker.FREE_LIMIT),
                "loginRequired", true
            ));
        }

        try {
            AnalysisResponse response = resumeService.analyzeResume(
                file, username, jobDescription, industry);
            if (!isLoggedIn) freeAnalysisTracker.record(clientIp);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error analyzing resume: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<PagedResponse<AnalysisResponse>> getHistory(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(resumeService.getHistory(page, size, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resumeService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
