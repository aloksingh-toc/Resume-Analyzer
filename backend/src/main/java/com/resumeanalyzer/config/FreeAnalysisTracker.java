package com.resumeanalyzer.config;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FreeAnalysisTracker {

    private static final int FREE_LIMIT = 3;

    private final Map<String, Integer> counts = new ConcurrentHashMap<>();

    public boolean hasUsedFreeAnalysis(String ip) {
        return counts.getOrDefault(ip, 0) >= FREE_LIMIT;
    }

    public void record(String ip) {
        counts.merge(ip, 1, Integer::sum);
    }
}
