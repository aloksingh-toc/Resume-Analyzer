package com.resumeanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analysis")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // null for anonymous analyses (pre-user-scoping or guest uploads)
    @Column(length = 150)
    private String username;

    @Column(nullable = false, length = 500)
    private String filename;

    @Column(nullable = false)
    private Integer score;

    // Section scores
    @Column
    private Integer summaryScore;

    @Column
    private Integer skillsScore;

    @Column
    private Integer experienceScore;

    @Column
    private Integer formattingScore;

    @Column
    private Integer professionalismScore;

    // Feedback text
    @Column(columnDefinition = "TEXT")
    private String summaryFeedback;

    @Column(columnDefinition = "TEXT")
    private String skillsFeedback;

    @Column(columnDefinition = "TEXT")
    private String experienceFeedback;

    @Column(columnDefinition = "TEXT")
    private String formattingFeedback;

    @Column(columnDefinition = "TEXT")
    private String overallFeedback;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}
