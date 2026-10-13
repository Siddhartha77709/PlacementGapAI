package ai.placementgap.repository;

import ai.placementgap.model.SkillGap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGapRepository extends JpaRepository<SkillGap, Long> {
    List<SkillGap> findByAnalysisIdOrderByIdAsc(Long analysisId);
}
