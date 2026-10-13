package ai.placementgap.controller;

import ai.placementgap.dto.*;
import ai.placementgap.service.AnalysisService;
import ai.placementgap.service.ProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlacementGapController.class)
class PlacementGapControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AnalysisService analysisService;

    @MockBean
    private ProfileService profileService;

    @Test
    @DisplayName("GET /api/v1/progress returns 200 and progress data")
    void getProgress_returnsOk() throws Exception {
        AnalysisResponseDto responseDto = new AnalysisResponseDto();
        responseDto.setReadiness(75);
        responseDto.setSkills(new SkillsSummaryDto(10, 2, 3, 5));
        responseDto.setGaps(new GapsDto(List.of("Docker"), List.of("Redis"), List.of("Java")));
        responseDto.setProgress(new ProgressSummaryDto(50, 40, 80));

        when(analysisService.progress()).thenReturn(responseDto);

        mockMvc.perform(get("/api/v1/progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.readiness").value(75))
                .andExpect(jsonPath("$.skills.total").value(10))
                .andExpect(jsonPath("$.gaps.missing[0]").value("Docker"));
    }

    @Test
    @DisplayName("POST /api/v1/analyze with blank job description returns 400 Bad Request")
    void analyze_withBlankJd_returns400() throws Exception {
        AnalysisRequestDto invalidRequest = new AnalysisRequestDto();
        invalidRequest.setJobTitle("Software Engineer");
        invalidRequest.setJobDescription(""); // Blank - should fail validation

        mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    @DisplayName("POST /api/v1/analyze with valid request returns 201 Created")
    void analyze_validRequest_returns201() throws Exception {
        AnalysisRequestDto validRequest = new AnalysisRequestDto();
        validRequest.setJobTitle("Senior Java Engineer");
        validRequest.setJobDescription("Requires 5+ years Java, Spring Boot, MySQL, Kafka, and Docker.");

        AnalysisResponseDto responseDto = new AnalysisResponseDto();
        responseDto.setId(1L);
        responseDto.setReadiness(80);
        responseDto.setJobTitle("Senior Java Engineer");
        when(analysisService.analyze(any(AnalysisRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/analyze")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.readiness").value(80));
    }

    @Test
    @DisplayName("POST /api/v1/progress/{id}/complete updates roadmap item status")
    void complete_updatesItem_returnsOk() throws Exception {
        AnalysisResponseDto updatedDto = new AnalysisResponseDto();
        updatedDto.setReadiness(85);
        updatedDto.setCompletedIds(List.of(1L));

        when(analysisService.complete(1L)).thenReturn(updatedDto);

        mockMvc.perform(post("/api/v1/progress/1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.readiness").value(85))
                .andExpect(jsonPath("$.completedIds[0]").value(1));
    }

    @Test
    @DisplayName("GET /api/v1/profile returns candidate profile")
    void getProfile_returnsOk() throws Exception {
        ProfileDto profileDto = new ProfileDto();
        profileDto.setFullName("John Doe");
        profileDto.setEmail("john@example.com");
        profileDto.setTargetRole("Backend Engineer");

        when(profileService.getProfile()).thenReturn(profileDto);

        mockMvc.perform(get("/api/v1/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("John Doe"))
                .andExpect(jsonPath("$.targetRole").value("Backend Engineer"));
    }
}
