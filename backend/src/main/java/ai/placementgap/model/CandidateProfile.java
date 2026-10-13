package ai.placementgap.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String email;

    private String targetRole;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String resumeText;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String projectsText;

    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    public CandidateProfile() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getProjectsText() {
        return projectsText;
    }

    public void setProjectsText(String projectsText) {
        this.projectsText = projectsText;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
