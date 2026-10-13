package ai.placementgap.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "skill_gaps")
public class SkillGap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id", nullable = false)
    @JsonIgnore
    private Analysis analysis;

    @Column(nullable = false)
    private String skillName;

    @Column(nullable = false, length = 50)
    private String classification; // MISSING, WEAK, MASTERED

    @Column(length = 50)
    private String priority = "MEDIUM"; // HIGH, MEDIUM, LOW

    @Column(length = 100)
    private String suggestedProficiency;

    private Instant createdAt = Instant.now();

    public SkillGap() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Analysis getAnalysis() {
        return analysis;
    }

    public void setAnalysis(Analysis analysis) {
        this.analysis = analysis;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getClassification() {
        return classification;
    }

    public void setClassification(String classification) {
        this.classification = classification;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getSuggestedProficiency() {
        return suggestedProficiency;
    }

    public void setSuggestedProficiency(String suggestedProficiency) {
        this.suggestedProficiency = suggestedProficiency;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
