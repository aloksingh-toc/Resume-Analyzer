package com.resumeanalyzer.config;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Shared HTTP utilities — avoids duplicating helper logic across classes.
 */
public final class HttpUtils {

    private HttpUtils() {}

    /**
     * Extracts the real client IP, respecting the X-Forwarded-For header
     * set by reverse proxies (Nginx, Render's load balancer, etc.).
     */
    public static String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
