package ai.placementgap.service;

import ai.placementgap.dto.AnalysisRequestDto;
import ai.placementgap.dto.AnalysisResponseDto;
import ai.placementgap.model.Analysis;
import ai.placementgap.model.RoadmapItem;
import ai.placementgap.model.SkillGap;
import ai.placementgap.repository.AnalysisRepository;
import ai.placementgap.repository.CandidateProfileRepository;
import ai.placementgap.repository.RoadmapItemRepository;
import ai.placementgap.repository.SkillGapRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalysisServiceTest {

    @Mock
    private GeminiAiService aiService;

    @Mock
    private AnalysisRepository analysisRepository;

    @Mock
    private SkillGapRepository skillGapRepository;

    @Mock
    private RoadmapItemRepository roadmapItemRepository;

    @Mock
    private CandidateProfileRepository profileRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private AnalysisService analysisService;

    @BeforeEach
    void setUp() {
        analysisService = new AnalysisService(
                aiService,
                analysisRepository,
                skillGapRepository,
                roadmapItemRepository,
                profileRepository,
                objectMapper
        );
    }

    @Test
    @DisplayName("progress() returns empty response when no analysis exists in repository")
    void progress_emptyState() {
        when(analysisRepository.findFirstByOrderByIdDesc()).thenReturn(Optional.empty());

        AnalysisResponseDto result = analysisService.progress();

        assertNotNull(result);
        assertEquals(0, result.getReadiness());
        assertEquals(0, result.getSkills().getTotal());
        assertTrue(result.getGaps().getMissing().isEmpty());
        assertTrue(result.getRoadmap().isEmpty());
    }

    @Test
    @DisplayName("analyze() persists entities and computes initial progress")
    void analyze_persistsAndCalculates() throws Exception {
        AnalysisRequestDto request = new AnalysisRequestDto();
        request.setJobTitle("Full Stack Dev");
        request.setJobDescription("React, Spring Boot, PostgreSQL, Docker, AWS");
        request.setSkills("React, Java");

        String fakeAiJson = """
                {
                  "readiness": 60,
                  "skills": { "total": 5, "missing": 2, "weak": 1, "mastered": 2 },
                  "gaps": {
                    "missing": ["Docker", "AWS"],
                    "weak": ["PostgreSQL"],
                    "mastered": ["React", "Java"]
                  },
                  "roadmap": [
                    { "id": 1, "title": "Learn Docker", "category": "Learning", "detail": "Basics", "done": false, "resource": "https://docker.com" },
                    { "id": 2, "title": "Deploy AWS App", "category": "Projects", "detail": "EC2 deploy", "done": false, "resource": "https://aws.amazon.com" }
                  ],
                  "progress": { "learning": 0, "projects": 0, "interview": 0 }
                }
                """;

        JsonNode fakeNode = objectMapper.readTree(fakeAiJson);
        when(aiService.analyze(any())).thenReturn(fakeNode);
        when(profileRepository.findFirstByOrderByIdDesc()).thenReturn(Optional.empty());

        Analysis savedAnalysis = new Analysis();
        savedAnalysis.setId(10L);
        savedAnalysis.setJobTitle("Full Stack Dev");
        savedAnalysis.setJobDescription("React, Spring Boot, PostgreSQL, Docker, AWS");
        savedAnalysis.setBaseReadiness(60);
        savedAnalysis.setCurrentReadiness(60);
        savedAnalysis.setTotalSkills(5);
        savedAnalysis.setMissingCount(2);
        savedAnalysis.setWeakCount(1);
        savedAnalysis.setMasteredCount(2);

        when(analysisRepository.save(any(Analysis.class))).thenReturn(savedAnalysis);

        AnalysisResponseDto response = analysisService.analyze(request);

        assertNotNull(response);
        assertEquals(60, response.getReadiness());
        verify(analysisRepository, atLeastOnce()).save(any(Analysis.class));
        verify(skillGapRepository).saveAll(any());
        verify(roadmapItemRepository).saveAll(any());
    }

    @Test
    @DisplayName("complete() updates completion state and recalculates readiness without inflation")
    void complete_updatesReadinessCorrectly() {
        Analysis analysis = new Analysis();
        analysis.setId(100L);
        analysis.setBaseReadiness(50);
        analysis.setCurrentReadiness(50);

        RoadmapItem item1 = new RoadmapItem();
        item1.setId(1L);
        item1.setTitle("Task 1");
        item1.setCategory("Learning");
        item1.setIsCompleted(false);
        item1.setAnalysis(analysis);

        RoadmapItem item2 = new RoadmapItem();
        item2.setId(2L);
        item2.setTitle("Task 2");
        item2.setCategory("Projects");
        item2.setIsCompleted(false);
        item2.setAnalysis(analysis);

        when(roadmapItemRepository.findById(1L)).thenReturn(Optional.of(item1));
        when(roadmapItemRepository.findByAnalysisIdOrderByItemOrderAsc(100L))
                .thenReturn(List.of(item1, item2));
        when(skillGapRepository.findByAnalysisIdOrderByIdAsc(100L)).thenReturn(new ArrayList<>());
        when(analysisRepository.save(any(Analysis.class))).thenAnswer(inv -> inv.getArgument(0));

        AnalysisResponseDto result = analysisService.complete(1L);

        // 1 of 2 completed: base 50 + (100 - 50) * (1 / 2) = 50 + 25 = 75
        assertEquals(75, result.getReadiness());
        assertTrue(item1.getIsCompleted());

        // Completing again: item1 already completed, should still be 75
        AnalysisResponseDto resultAgain = analysisService.complete(1L);
        assertEquals(75, resultAgain.getReadiness());
    }
}
