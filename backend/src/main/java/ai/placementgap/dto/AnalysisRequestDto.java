package ai.placementgap.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class AnalysisRequestDto {

    private String jobTitle = "Target Role";

    @NotBlank(message = "Job description is required")
    private String jobDescription;

    private String resume;

    private Object skills; // Can be List<String> or comma-separated String

    private String projects;

    private String candidateName;

    private String candidateEmail;

    public AnalysisRequestDto() {}

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

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    public Object getSkills() {
        return skills;
    }

    public void setSkills(Object skills) {
        this.skills = skills;
    }

    public String getProjects() {
        return projects;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getSkillsAsString() {
        if (skills == null) return "";
        if (skills instanceof List<?> list) {
            return String.join(", ", list.stream().map(Object::toString).toList());
        }
        return skills.toString();
    }
}
