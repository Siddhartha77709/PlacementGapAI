package ai.placementgap.dto;

public class SkillsSummaryDto {
    private int total;
    private int missing;
    private int weak;
    private int mastered;

    public SkillsSummaryDto() {}

    public SkillsSummaryDto(int total, int missing, int weak, int mastered) {
        this.total = total;
        this.missing = missing;
        this.weak = weak;
        this.mastered = mastered;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getMissing() {
        return missing;
    }

    public void setMissing(int missing) {
        this.missing = missing;
    }

    public int getWeak() {
        return weak;
    }

    public void setWeak(int weak) {
        this.weak = weak;
    }

    public int getMastered() {
        return mastered;
    }

    public void setMastered(int mastered) {
        this.mastered = mastered;
    }
}
