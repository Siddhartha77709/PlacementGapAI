package ai.placementgap.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "analyses")
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private CandidateProfile profile;

    @Column(nullable = false)
    private String jobTitle;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String jobDescription;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String candidateResume;

    @Column(columnDefinition = "TEXT")
    private String candidateSkills;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String candidateProjects;

    private Integer baseReadiness = 0;

    private Integer currentReadiness = 0;

    private Integer learningProgress = 0;

    private Integer projectsProgress = 0;

    private Integer interviewProgress = 0;

    private Integer totalSkills = 0;

    private Integer missingCount = 0;

    private Integer weakCount = 0;

    private Integer masteredCount = 0;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String rawModelResponse;

    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<SkillGap> skillGaps = new ArrayList<>();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("itemOrder ASC")
    private List<RoadmapItem> roadmapItems = new ArrayList<>();

    public Analysis() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CandidateProfile getProfile() {
        return profile;
    }

    public void setProfile(CandidateProfile profile) {
        this.profile = profile;
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

    public String getCandidateResume() {
        return candidateResume;
    }

    public void setCandidateResume(String candidateResume) {
        this.candidateResume = candidateResume;
    }

    public String getCandidateSkills() {
        return candidateSkills;
    }

    public void setCandidateSkills(String candidateSkills) {
        this.candidateSkills = candidateSkills;
    }

    public String getCandidateProjects() {
        return candidateProjects;
    }

    public void setCandidateProjects(String candidateProjects) {
        this.candidateProjects = candidateProjects;
    }

    public Integer getBaseReadiness() {
        return baseReadiness;
    }

    public void setBaseReadiness(Integer baseReadiness) {
        this.baseReadiness = baseReadiness;
    }

    public Integer getCurrentReadiness() {
        return currentReadiness;
    }

    public void setCurrentReadiness(Integer currentReadiness) {
        this.currentReadiness = currentReadiness;
    }

    public Integer getLearningProgress() {
        return learningProgress;
    }

    public void setLearningProgress(Integer learningProgress) {
        this.learningProgress = learningProgress;
    }

    public Integer getProjectsProgress() {
        return projectsProgress;
    }

    public void setProjectsProgress(Integer projectsProgress) {
        this.projectsProgress = projectsProgress;
    }

    public Integer getInterviewProgress() {
        return interviewProgress;
    }

    public void setInterviewProgress(Integer interviewProgress) {
        this.interviewProgress = interviewProgress;
    }

    public Integer getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(Integer totalSkills) {
        this.totalSkills = totalSkills;
    }

    public Integer getMissingCount() {
        return missingCount;
    }

    public void setMissingCount(Integer missingCount) {
        this.missingCount = missingCount;
    }

    public Integer getWeakCount() {
        return weakCount;
    }

    public void setWeakCount(Integer weakCount) {
        this.weakCount = weakCount;
    }

    public Integer getMasteredCount() {
        return masteredCount;
    }

    public void setMasteredCount(Integer masteredCount) {
        this.masteredCount = masteredCount;
    }

    public String getRawModelResponse() {
        return rawModelResponse;
    }

    public void setRawModelResponse(String rawModelResponse) {
        this.rawModelResponse = rawModelResponse;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<SkillGap> getSkillGaps() {
        return skillGaps;
    }

    public void setSkillGaps(List<SkillGap> skillGaps) {
        this.skillGaps = skillGaps;
    }

    public List<RoadmapItem> getRoadmapItems() {
        return roadmapItems;
    }

    public void setRoadmapItems(List<RoadmapItem> roadmapItems) {
        this.roadmapItems = roadmapItems;
    }
}
