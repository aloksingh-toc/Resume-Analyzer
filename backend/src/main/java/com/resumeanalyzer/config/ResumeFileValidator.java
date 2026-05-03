package com.resumeanalyzer.config;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * Validates an uploaded resume file before it reaches the service layer.
 * Throws {@link InvalidFileException} for any constraint violation.
 */
@Component
public class ResumeFileValidator {

    public static final long MAX_FILE_BYTES = 5L * 1024 * 1024; // 5 MB

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Please upload a PDF file.");
        }
        String ct = file.getContentType();
        if (ct == null || !ct.equalsIgnoreCase("application/pdf")) {
            throw new InvalidFileException("Only PDF files are supported.");
        }
        if (file.getSize() > MAX_FILE_BYTES) {
            throw new InvalidFileException("File size must be under 5 MB.");
        }
    }

    public static class InvalidFileException extends RuntimeException {
        public InvalidFileException(String message) { super(message); }
    }
}
