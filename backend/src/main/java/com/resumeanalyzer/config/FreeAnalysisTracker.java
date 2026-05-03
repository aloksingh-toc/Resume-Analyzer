package com.resumeanalyzer.config;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks how many free analyses each guest IP has consumed.
 *
 * Each IP gets FREE_LIMIT analyses per WINDOW_HOURS rolling window.
 * Stale entries (outside the window) are purged lazily on every write
 * so the map never grows without bound.
 */
@Component
public class FreeAnalysisTracker {

    public  static final int  FREE_LIMIT    = 3;
    private static final long WINDOW_MILLIS = 24L * 60 * 60 * 1000; // 24 hours
    private static final int  MAX_ENTRIES   = 10_000;                // memory guard

    /** value[0] = count,  value[1] = window-start epoch-millis */
    private final Map<String, long[]> counts = new ConcurrentHashMap<>();

    public boolean hasUsedFreeAnalysis(String ip) {
        long[] rec = counts.get(ip);
        if (rec == null) return false;
        if (isExpired(rec)) { counts.remove(ip); return false; }
        return rec[0] >= FREE_LIMIT;
    }

    public void record(String ip) {
        purgeStale();
        counts.compute(ip, (key, rec) -> {
            long now = Instant.now().toEpochMilli();
            if (rec == null || isExpired(rec)) return new long[]{ 1, now };
            rec[0]++;
            return rec;
        });
    }

    // ── Internals ────────────────────────────────────────────────────────────

    private boolean isExpired(long[] rec) {
        return Instant.now().toEpochMilli() - rec[1] > WINDOW_MILLIS;
    }

    /** Remove entries whose 24-hour window has passed, and cap map size. */
    private void purgeStale() {
        if (counts.size() < MAX_ENTRIES / 2) return; // skip purge when map is small
        Iterator<Map.Entry<String, long[]>> it = counts.entrySet().iterator();
        int removed = 0;
        while (it.hasNext() && removed < MAX_ENTRIES / 4) {
            if (isExpired(it.next().getValue())) { it.remove(); removed++; }
        }
    }
}
