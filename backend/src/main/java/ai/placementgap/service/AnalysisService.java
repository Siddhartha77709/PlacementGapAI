package ai.placementgap.service;

import ai.placementgap.dto.*;
import ai.placementgap.model.Analysis;
import ai.placementgap.model.CandidateProfile;
import ai.placementgap.model.RoadmapItem;
import ai.placementgap.model.SkillGap;
import ai.placementgap.repository.AnalysisRepository;
import ai.placementgap.repository.CandidateProfileRepository;
import ai.placementgap.repository.RoadmapItemRepository;
import ai.placementgap.repository.SkillGapRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class AnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    private final GeminiAiService aiService;
    private final AnalysisRepository analysisRepository;
    private final SkillGapRepository skillGapRepository;
    private final RoadmapItemRepository roadmapItemRepository;
    private final CandidateProfileRepository profileRepository;
    private final ObjectMapper mapper;

    public AnalysisService(
            GeminiAiService aiService,
            AnalysisRepository analysisRepository,
            SkillGapRepository skillGapRepository,
            RoadmapItemRepository roadmapItemRepository,
            CandidateProfileRepository profileRepository,
            ObjectMapper mapper
    ) {
        this.aiService = aiService;
        this.analysisRepository = analysisRepository;
        this.skillGapRepository = skillGapRepository;
        this.roadmapItemRepository = roadmapItemRepository;
        this.profileRepository = profileRepository;
        this.mapper = mapper;
    }

    @Transactional
    public AnalysisResponseDto analyze(AnalysisRequestDto request) {
        String jobTitle = request.getJobTitle() != null && !request.getJobTitle().isBlank()
                ? request.getJobTitle().trim()
                : "Target Role";
        String jobDescription = request.getJobDescription();
        if (jobDescription == null || jobDescription.trim().isEmpty()) {
            throw new IllegalArgumentException("Job description is required.");
        }

        Map<String, Object> candidateData = new LinkedHashMap<>();
        candidateData.put("jobTitle", jobTitle);
        candidateData.put("jobDescription", jobDescription);
        candidateData.put("resume", request.getResume() != null ? request.getResume() : "");
        candidateData.put("skills", request.getSkillsAsString());
        candidateData.put("projects", request.getProjects() != null ? request.getProjects() : "");

        // Call Gemini
        JsonNode modelResponse = aiService.analyze(candidateData);

        // Optional: save profile if not existing
        CandidateProfile profile = profileRepository.findFirstByOrderByIdDesc().orElse(null);

        Analysis analysis = new Analysis();
        analysis.setProfile(profile);
        analysis.setJobTitle(jobTitle);
        analysis.setJobDescription(jobDescription);
        analysis.setCandidateResume(request.getResume());
        analysis.setCandidateSkills(request.getSkillsAsString());
        analysis.setCandidateProjects(request.getProjects());

        int parsedReadiness = Math.max(0, Math.min(100, modelResponse.path("readiness").asInt(50)));
        analysis.setBaseReadiness(parsedReadiness);
        analysis.setCurrentReadiness(parsedReadiness);

        JsonNode skillsNode = modelResponse.path("skills");
        int totalSkills = skillsNode.path("total").asInt(0);
        int missingCount = skillsNode.path("missing").asInt(0);
        int weakCount = skillsNode.path("weak").asInt(0);
        int masteredCount = skillsNode.path("mastered").asInt(0);

        analysis.setTotalSkills(totalSkills);
        analysis.setMissingCount(missingCount);
        analysis.setWeakCount(weakCount);
        analysis.setMasteredCount(masteredCount);

        try {
            analysis.setRawModelResponse(mapper.writeValueAsString(modelResponse));
        } catch (Exception e) {
            analysis.setRawModelResponse("{}");
        }

        Analysis savedAnalysis = analysisRepository.save(analysis);

        // Process Skill Gaps
        JsonNode gapsNode = modelResponse.path("gaps");
        List<SkillGap> skillGaps = new ArrayList<>();
        populateSkillGaps(savedAnalysis, gapsNode.path("missing"), "MISSING", "HIGH", skillGaps);
        populateSkillGaps(savedAnalysis, gapsNode.path("weak"), "WEAK", "MEDIUM", skillGaps);
        populateSkillGaps(savedAnalysis, gapsNode.path("mastered"), "MASTERED", "LOW", skillGaps);
        skillGapRepository.saveAll(skillGaps);

        // If total skills was 0, calculate from parsed gaps
        if (totalSkills == 0) {
            savedAnalysis.setMissingCount(gapsNode.path("missing").size());
            savedAnalysis.setWeakCount(gapsNode.path("weak").size());
            savedAnalysis.setMasteredCount(gapsNode.path("mastered").size());
            savedAnalysis.setTotalSkills(savedAnalysis.getMissingCount() + savedAnalysis.getWeakCount() + savedAnalysis.getMasteredCount());
        }

        // Process Roadmap Modules
        JsonNode roadmapArray = modelResponse.path("roadmap");
        List<RoadmapItem> roadmapItems = new ArrayList<>();
        if (roadmapArray.isArray()) {
            int order = 1;
            for (JsonNode itemNode : roadmapArray) {
                RoadmapItem item = new RoadmapItem();
                item.setAnalysis(savedAnalysis);
                item.setItemOrder(order++);
                item.setTitle(itemNode.path("title").asText("Recommended Action").trim());
                item.setCategory(normalizeCategory(itemNode.path("category").asText("Learning")));
                item.setDetail(itemNode.path("detail").asText("").trim());
                item.setResourceUrl(itemNode.path("resource").asText("").trim());
                item.setIsCompleted(false);
                roadmapItems.add(item);
            }
        }
        roadmapItemRepository.saveAll(roadmapItems);

        // Save progress indicators
        calculateAndApplyProgress(savedAnalysis, roadmapItems);
        analysisRepository.save(savedAnalysis);

        return toResponseDto(savedAnalysis, skillGaps, roadmapItems);
    }

    @Transactional(readOnly = true)
    public AnalysisResponseDto progress() {
        Optional<Analysis> latestOpt = analysisRepository.findFirstByOrderByIdDesc();
        if (latestOpt.isEmpty()) {
            return createEmptyResponse();
        }

        Analysis analysis = latestOpt.get();
        List<SkillGap> gaps = skillGapRepository.findByAnalysisIdOrderByIdAsc(analysis.getId());
        List<RoadmapItem> roadmap = roadmapItemRepository.findByAnalysisIdOrderByItemOrderAsc(analysis.getId());

        return toResponseDto(analysis, gaps, roadmap);
    }

    @Transactional
    public AnalysisResponseDto complete(Long roadmapItemId) {
        RoadmapItem item = roadmapItemRepository.findById(roadmapItemId)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap item not found with ID: " + roadmapItemId));

        Analysis analysis = item.getAnalysis();
        if (!item.getIsCompleted()) {
            item.setIsCompleted(true);
            item.setCompletedAt(Instant.now());
            roadmapItemRepository.save(item);
        }

        List<RoadmapItem> allItems = roadmapItemRepository.findByAnalysisIdOrderByItemOrderAsc(analysis.getId());
        List<SkillGap> allGaps = skillGapRepository.findByAnalysisIdOrderByIdAsc(analysis.getId());

        calculateAndApplyProgress(analysis, allItems);
        Analysis updatedAnalysis = analysisRepository.save(analysis);

        return toResponseDto(updatedAnalysis, allGaps, allItems);
    }

    private void calculateAndApplyProgress(Analysis analysis, List<RoadmapItem> roadmapItems) {
        if (roadmapItems.isEmpty()) {
            analysis.setLearningProgress(0);
            analysis.setProjectsProgress(0);
            analysis.setInterviewProgress(0);
            analysis.setCurrentReadiness(analysis.getBaseReadiness());
            return;
        }

        int totalCount = roadmapItems.size();
        long completedCount = roadmapItems.stream().filter(RoadmapItem::getIsCompleted).count();

        int learningTotal = 0, learningDone = 0;
        int projectsTotal = 0, projectsDone = 0;
        int interviewTotal = 0, interviewDone = 0;

        for (RoadmapItem it : roadmapItems) {
            String cat = it.getCategory().toLowerCase();
            if (cat.contains("learn")) {
                learningTotal++;
                if (it.getIsCompleted()) learningDone++;
            } else if (cat.contains("project") || cat.contains("build")) {
                projectsTotal++;
                if (it.getIsCompleted()) projectsDone++;
            } else {
                interviewTotal++;
                if (it.getIsCompleted()) interviewDone++;
            }
        }

        analysis.setLearningProgress(learningTotal > 0 ? (int) Math.round((learningDone * 100.0) / learningTotal) : 0);
        analysis.setProjectsProgress(projectsTotal > 0 ? (int) Math.round((projectsDone * 100.0) / projectsTotal) : 0);
        analysis.setInterviewProgress(interviewTotal > 0 ? (int) Math.round((interviewDone * 100.0) / interviewTotal) : 0);

        // Documented Business Rule for Readiness Recalculation:
        // Base readiness represents initial assessment (0-100).
        // Each completed roadmap item progressively closes the gap between baseReadiness and 100%.
        int base = analysis.getBaseReadiness() != null ? analysis.getBaseReadiness() : 50;
        int remainingGap = 100 - base;
        int calculated = base + (int) Math.round(remainingGap * ((double) completedCount / totalCount));
        analysis.setCurrentReadiness(Math.max(0, Math.min(100, calculated)));
    }

    private void populateSkillGaps(Analysis analysis, JsonNode arrayNode, String classification, String priority, List<SkillGap> targetList) {
        if (arrayNode.isArray()) {
            for (JsonNode s : arrayNode) {
                String text = s.asText("").trim();
                if (!text.isEmpty()) {
                    SkillGap gap = new SkillGap();
                    gap.setAnalysis(analysis);
                    gap.setSkillName(text);
                    gap.setClassification(classification);
                    gap.setPriority(priority);
                    gap.setSuggestedProficiency(classification.equals("MISSING") ? "Intermediate" : "Advanced");
                    targetList.add(gap);
                }
            }
        }
    }

    private String normalizeCategory(String category) {
        if (category == null) return "Learning";
        String lower = category.toLowerCase();
        if (lower.contains("project") || lower.contains("build")) return "Projects";
        if (lower.contains("interview") || lower.contains("prep")) return "Interview Prep";
        return "Learning";
    }

    private AnalysisResponseDto toResponseDto(Analysis analysis, List<SkillGap> gaps, List<RoadmapItem> roadmap) {
        AnalysisResponseDto dto = new AnalysisResponseDto();
        dto.setId(analysis.getId());
        dto.setReadiness(analysis.getCurrentReadiness());
        dto.setJobTitle(analysis.getJobTitle());
        dto.setJobDescription(analysis.getJobDescription());
        dto.setCreatedAt(analysis.getCreatedAt());

        // Skills counts
        int total = analysis.getTotalSkills() != null ? analysis.getTotalSkills() : 0;
        int missing = analysis.getMissingCount() != null ? analysis.getMissingCount() : 0;
        int weak = analysis.getWeakCount() != null ? analysis.getWeakCount() : 0;
        int mastered = analysis.getMasteredCount() != null ? analysis.getMasteredCount() : 0;
        dto.setSkills(new SkillsSummaryDto(total, missing, weak, mastered));

        // Categorized gaps
        List<String> missingList = new ArrayList<>();
        List<String> weakList = new ArrayList<>();
        List<String> masteredList = new ArrayList<>();
        for (SkillGap g : gaps) {
            if ("MISSING".equalsIgnoreCase(g.getClassification())) missingList.add(g.getSkillName());
            else if ("WEAK".equalsIgnoreCase(g.getClassification())) weakList.add(g.getSkillName());
            else if ("MASTERED".equalsIgnoreCase(g.getClassification())) masteredList.add(g.getSkillName());
        }
        dto.setGaps(new GapsDto(missingList, weakList, masteredList));

        // Roadmap & completed IDs
        List<RoadmapItemDto> roadmapDtos = new ArrayList<>();
        List<Long> completedIds = new ArrayList<>();
        for (RoadmapItem it : roadmap) {
            boolean done = Boolean.TRUE.equals(it.getIsCompleted());
            if (done) completedIds.add(it.getId());
            roadmapDtos.add(new RoadmapItemDto(
                    it.getId(),
                    it.getTitle(),
                    it.getCategory(),
                    it.getDetail(),
                    done,
                    it.getResourceUrl(),
                    it.getItemOrder()
            ));
        }
        dto.setRoadmap(roadmapDtos);
        dto.setCompletedIds(completedIds);

        // Progress
        dto.setProgress(new ProgressSummaryDto(
                analysis.getLearningProgress() != null ? analysis.getLearningProgress() : 0,
                analysis.getProjectsProgress() != null ? analysis.getProjectsProgress() : 0,
                analysis.getInterviewProgress() != null ? analysis.getInterviewProgress() : 0
        ));

        return dto;
    }

    private AnalysisResponseDto createEmptyResponse() {
        AnalysisResponseDto empty = new AnalysisResponseDto();
        empty.setId(null);
        empty.setReadiness(0);
        empty.setSkills(new SkillsSummaryDto(0, 0, 0, 0));
        empty.setGaps(new GapsDto(List.of(), List.of(), List.of()));
        empty.setRoadmap(List.of());
        empty.setProgress(new ProgressSummaryDto(0, 0, 0));
        empty.setCompletedIds(List.of());
        return empty;
    }
}
