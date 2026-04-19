package com.resumeanalyzer.controller;

import com.resumeanalyzer.config.FreeAnalysisTracker;
import com.resumeanalyzer.dto.AnalysisResponse;
import com.resumeanalyzer.dto.PagedResponse;
import com.resumeanalyzer.service.ResumeService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeService       resumeService;
    private final FreeAnalysisTracker freeAnalysisTracker;

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeResume(@RequestParam("file") MultipartFile file,
                                           HttpServletRequest request) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please upload a PDF file."));
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equalsIgnoreCase("application/pdf")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PDF files are supported."));
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size must be under 5 MB."));
        }

        Authentication auth     = SecurityContextHolder.getContext().getAuthentication();
        boolean isLoggedIn      = auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
        String  clientIp        = getClientIp(request);

        if (!isLoggedIn && freeAnalysisTracker.hasUsedFreeAnalysis(clientIp)) {
            return ResponseEntity.status(403).body(Map.of(
                "error",        "You've used your 1 free analysis. Sign in for unlimited access.",
                "loginRequired", true
            ));
        }

        try {
            AnalysisResponse response = resumeService.analyzeResume(file);
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
        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(resumeService.getHistory(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resumeService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        return request.getRemoteAddr();
    }
}
