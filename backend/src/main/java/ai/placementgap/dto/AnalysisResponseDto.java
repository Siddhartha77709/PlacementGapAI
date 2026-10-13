package ai.placementgap.dto;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class AnalysisResponseDto {
    private Long id;
    private int readiness;
    private SkillsSummaryDto skills = new SkillsSummaryDto();
    private GapsDto gaps = new GapsDto();
    private List<RoadmapItemDto> roadmap = new ArrayList<>();
    private ProgressSummaryDto progress = new ProgressSummaryDto();
    private List<Long> completedIds = new ArrayList<>();
    private String jobTitle;
    private String jobDescription;
    private Instant createdAt;

    public AnalysisResponseDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getReadiness() {
        return readiness;
    }

    public void setReadiness(int readiness) {
        this.readiness = readiness;
    }

    public SkillsSummaryDto getSkills() {
        return skills;
    }

    public void setSkills(SkillsSummaryDto skills) {
        this.skills = skills;
    }

    public GapsDto getGaps() {
        return gaps;
    }

    public void setGaps(GapsDto gaps) {
        this.gaps = gaps;
    }

    public List<RoadmapItemDto> getRoadmap() {
        return roadmap;
    }

    public void setRoadmap(List<RoadmapItemDto> roadmap) {
        this.roadmap = roadmap;
    }

    public ProgressSummaryDto getProgress() {
        return progress;
    }

    public void setProgress(ProgressSummaryDto progress) {
        this.progress = progress;
    }

    public List<Long> getCompletedIds() {
        return completedIds;
    }

    public void setCompletedIds(List<Long> completedIds) {
        this.completedIds = completedIds;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
