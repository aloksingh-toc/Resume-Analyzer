package com.resumeanalyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeanalyzer.dto.AIFeedback;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.1-8b-instant";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public AIFeedback analyzeResume(String resumeText) throws Exception {

        String prompt = buildPrompt(resumeText);

        Map<String, Object> requestBody = Map.of(
            "model", MODEL,
            "messages", List.of(
                Map.of("role", "system", "content",
                    "You are a strict, professional resume reviewer. " +
                    "You give HONEST and VARIED scores — weak resumes get 20-40, " +
                    "average resumes get 41-65, good resumes get 66-80, " +
                    "excellent resumes get 81-100. " +
                    "Never give the same score twice unless resumes are identical. " +
                    "Return ONLY valid JSON. No markdown. No explanation."),
                Map.of("role", "user", "content", prompt)
            ),
            "temperature", 0.9,
            "max_tokens", 1200
        );

        String requestJson = objectMapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(GROQ_URL))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + groqApiKey)
            .POST(HttpRequest.BodyPublishers.ofString(requestJson))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Groq API error: " + response.statusCode() + " — " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        String content = root
            .path("choices")
            .get(0)
            .path("message")
            .path("content")
            .asText();

        content = content.trim();
        if (content.startsWith("```")) {
            content = content
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();
        }

        return objectMapper.readValue(content, AIFeedback.class);
    }

    private String buildPrompt(String resumeText) {
        return """
            Carefully analyze this resume and give an HONEST score based on actual quality.

            SCORING RULES (be strict and accurate):
            - 0-20:   Very poor. Missing most sections, no structure, major issues.
            - 21-40:  Weak. Has basic info but lacks detail, impact, or clarity.
            - 41-55:  Below average. Some good parts but many areas need improvement.
            - 56-70:  Average. Decent resume but missing quantified achievements or has gaps.
            - 71-82:  Good. Well-structured with some measurable results.
            - 83-92:  Very good. Strong resume with clear impact and professional presentation.
            - 93-100: Excellent. Outstanding resume, ready to send to top companies.

            Return ONLY this JSON object — no markdown, no extra text:
            {
              "score": <integer 0-100 based strictly on above rubric>,
              "summary_score": <integer 0-20>,
              "skills_score": <integer 0-20>,
              "experience_score": <integer 0-30>,
              "formatting_score": <integer 0-15>,
              "professionalism_score": <integer 0-15>,
              "summary_feedback": "<specific feedback on summary/objective — what is missing or strong>",
              "skills_feedback": "<specific feedback on skills — are they relevant, well-organized, current?>",
              "experience_feedback": "<specific feedback on experience — do bullets have impact, metrics, action verbs?>",
              "formatting_feedback": "<specific feedback on layout, length, fonts, whitespace, ATS friendliness>",
              "overall_feedback": "<3 specific actionable improvements this candidate MUST make to get more interviews>"
            }

            Resume to analyze:
            ---
            """ + resumeText + """
            ---
            Important: Base the score on ACTUAL content quality. Be critical and honest.
            """;
    }
}
