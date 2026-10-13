package ai.placementgap.dto;

public class ProgressSummaryDto {
    private int learning;
    private int projects;
    private int interview;

    public ProgressSummaryDto() {}

    public ProgressSummaryDto(int learning, int projects, int interview) {
        this.learning = learning;
        this.projects = projects;
        this.interview = interview;
    }

    public int getLearning() {
        return learning;
    }

    public void setLearning(int learning) {
        this.learning = learning;
    }

    public int getProjects() {
        return projects;
    }

    public void setProjects(int projects) {
        this.projects = projects;
    }

    public int getInterview() {
        return interview;
    }

    public void setInterview(int interview) {
        this.interview = interview;
    }
}
