package ai.placementgap.dto;

import java.util.ArrayList;
import java.util.List;

public class GapsDto {
    private List<String> missing = new ArrayList<>();
    private List<String> weak = new ArrayList<>();
    private List<String> mastered = new ArrayList<>();

    public GapsDto() {}

    public GapsDto(List<String> missing, List<String> weak, List<String> mastered) {
        this.missing = missing != null ? missing : new ArrayList<>();
        this.weak = weak != null ? weak : new ArrayList<>();
        this.mastered = mastered != null ? mastered : new ArrayList<>();
    }

    public List<String> getMissing() {
        return missing;
    }

    public void setMissing(List<String> missing) {
        this.missing = missing;
    }

    public List<String> getWeak() {
        return weak;
    }

    public void setWeak(List<String> weak) {
        this.weak = weak;
    }

    public List<String> getMastered() {
        return mastered;
    }

    public void setMastered(List<String> mastered) {
        this.mastered = mastered;
    }
}
