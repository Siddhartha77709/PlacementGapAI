package ai.placementgap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.time.Duration;
import java.util.*;

@Service
public class GeminiAiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);

    private final RestClient restClient;
    private final ObjectMapper mapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    public GeminiAiService(ObjectMapper mapper) {
        this.mapper = mapper;
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(15));
        requestFactory.setReadTimeout(Duration.ofSeconds(60));
        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    public JsonNode analyze(Map<String, Object> candidateData) {
        if (!isConfigured()) {
            throw new IllegalStateException("Google Gemini API key is not configured on the server. Please set GEMINI_API_KEY.");
        }

        String targetRole = String.valueOf(candidateData.getOrDefault("jobTitle", "Target Role")).trim();
        String jobDescription = String.valueOf(candidateData.getOrDefault("jobDescription", "")).trim();
        String resume = String.valueOf(candidateData.getOrDefault("resume", "")).trim();
        String skills = String.valueOf(candidateData.getOrDefault("skills", "")).trim();
        String projects = String.valueOf(candidateData.getOrDefault("projects", "")).trim();

        if (jobDescription.isEmpty()) {
            throw new IllegalArgumentException("Job description is required for gap analysis.");
        }

        String prompt = buildPrompt(targetRole, jobDescription, resume, skills, projects);

        Map<String, Object> payload = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "temperature", 0.2,
                        "maxOutputTokens", 4096
                )
        );

        List<String> candidateModels = new ArrayList<>();
        if (model != null && !model.isBlank()) {
            candidateModels.add(model.trim());
        }
        if (!candidateModels.contains("gemini-3.1-flash-lite")) {
            candidateModels.add("gemini-3.1-flash-lite");
        }
        if (!candidateModels.contains("gemini-3.5-flash")) {
            candidateModels.add("gemini-3.5-flash");
        }

        Exception lastException = null;
        for (String activeModel : candidateModels) {
            String endpointUrl = String.format("%s/models/%s:generateContent", baseUrl.replaceAll("/+$", ""), activeModel);
            int maxAttempts = 2;
            for (int attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    log.info("Sending request to Gemini API (model: {}, attempt: {}) without leaking credentials", activeModel, attempt);
                    String rawResponse = restClient.post()
                            .uri(endpointUrl)
                            .header("x-goog-api-key", apiKey.trim())
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(payload)
                            .retrieve()
                            .body(String.class);

                    return parseAndValidateGeminiResponse(rawResponse);
                } catch (RestClientResponseException e) {
                    int statusCode = e.getStatusCode().value();
                    log.warn("Gemini API returned HTTP status {} for model {} on attempt {}", statusCode, activeModel, attempt);
                    lastException = e;
                    if ((statusCode == 429 || statusCode == 503 || statusCode == 500) && attempt < maxAttempts) {
                        try {
                            Thread.sleep(1200L * attempt);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new IllegalStateException("Gemini request was interrupted");
                        }
                        continue;
                    }
                    if (statusCode == 404 || statusCode == 503) {
                        log.info("Model {} returned HTTP {}, attempting next fallback model if available", activeModel, statusCode);
                        break; // Try next fallback model
                    }
                    if (statusCode == 400) {
                        throw new IllegalStateException("Gemini API rejected request format or payload for model: " + activeModel);
                    } else if (statusCode == 401 || statusCode == 403) {
                        throw new IllegalStateException("Gemini API authentication failed (HTTP " + statusCode + "). Please verify GEMINI_API_KEY.");
                    } else if (statusCode == 429) {
                        throw new IllegalStateException("Gemini API rate limit exceeded. Please retry after a brief pause.");
                    } else if (statusCode >= 500) {
                        throw new IllegalStateException("Gemini upstream service error (HTTP " + statusCode + "). Please try again shortly.");
                    }
                    throw new IllegalStateException("Gemini API request failed with status HTTP " + statusCode);
                } catch (Exception e) {
                    log.error("Failed to communicate with Gemini API (model: {}): {}", activeModel, e.getClass().getSimpleName());
                    lastException = e;
                    break;
                }
            }
        }
        throw new IllegalStateException("Failed to obtain response from Gemini API after trying candidate models: " +
                (lastException != null ? lastException.getMessage() : "All candidates exhausted."));
    }

    private JsonNode parseAndValidateGeminiResponse(String rawResponse) {
        if (rawResponse == null || rawResponse.trim().isEmpty()) {
            throw new IllegalStateException("Gemini API returned an empty response body.");
        }

        try {
            JsonNode root = mapper.readTree(rawResponse);
            JsonNode candidatesNode = root.path("candidates");
            if (!candidatesNode.isArray() || candidatesNode.isEmpty()) {
                throw new IllegalStateException("Gemini API returned no response candidates.");
            }

            JsonNode parts = candidatesNode.get(0).path("content").path("parts");
            if (!parts.isArray() || parts.isEmpty()) {
                throw new IllegalStateException("Gemini API returned candidate with no content parts.");
            }

            String text = parts.get(0).path("text").asText("");
            if (text.trim().isEmpty()) {
                throw new IllegalStateException("Gemini API returned empty text part.");
            }

            // Strip possible markdown fences if returned
            String sanitizedJson = text.trim()
                    .replaceAll("^```(?:json)?\\s*", "")
                    .replaceAll("\\s*```$", "")
                    .trim();

            JsonNode parsed = mapper.readTree(sanitizedJson);

            // Validate essential fields exist
            if (!parsed.has("readiness") || !parsed.has("skills") || !parsed.has("gaps") || !parsed.has("roadmap")) {
                throw new IllegalStateException("Gemini JSON response is missing required analysis fields (readiness, skills, gaps, or roadmap).");
            }

            return parsed;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse structured JSON from Gemini API: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String role, String jd, String resume, String skills, String projects) {
        return "You are an expert technical recruiter and career coach analyzing placement readiness.\n"
                + "Compare the candidate profile against the target job requirements.\n"
                + "Provide an honest, realistic, and constructive analysis.\n"
                + "Return ONLY a valid JSON object matching exactly this schema:\n"
                + "{\n"
                + "  \"readiness\": 0 to 100 integer representing percentage placement readiness,\n"
                + "  \"skills\": {\n"
                + "    \"total\": integer count of critical skills required by the job,\n"
                + "    \"missing\": integer count of skills candidate completely lacks,\n"
                + "    \"weak\": integer count of skills candidate has only basic/partial knowledge of,\n"
                + "    \"mastered\": integer count of skills candidate has proven competency in\n"
                + "  },\n"
                + "  \"gaps\": {\n"
                + "    \"missing\": [\"Skill A\", \"Skill B\"],\n"
                + "    \"weak\": [\"Skill C\"],\n"
                + "    \"mastered\": [\"Skill D\", \"Skill E\"]\n"
                + "  },\n"
                + "  \"roadmap\": [\n"
                + "    {\n"
                + "      \"id\": 1,\n"
                + "      \"title\": \"Descriptive Module Title\",\n"
                + "      \"category\": \"Learning\" or \"Projects\" or \"Interview Prep\",\n"
                + "      \"detail\": \"Specific actionable guidance on what to learn or build.\",\n"
                + "      \"done\": false,\n"
                + "      \"resource\": \"https://link-to-legitimate-documentation-or-course-or-guide\"\n"
                + "    }\n"
                + "  ],\n"
                + "  \"progress\": {\n"
                + "    \"learning\": 0,\n"
                + "    \"projects\": 0,\n"
                + "    \"interview\": 0\n"
                + "  }\n"
                + "}\n\n"
                + "Candidate Information:\n"
                + "- Target Role: " + role + "\n"
                + "- Self-Rated / Claimed Skills: " + (skills.isEmpty() ? "Not specified" : skills) + "\n"
                + "- Resume Content: " + (resume.isEmpty() ? "No resume uploaded" : resume) + "\n"
                + "- Projects & Experience: " + (projects.isEmpty() ? "None specified" : projects) + "\n\n"
                + "Target Job Description:\n" + jd + "\n\n"
                + "Ensure roadmap contains 4-8 distinct, high-impact modules across Learning, Projects, and Interview Prep categories.";
    }
}
