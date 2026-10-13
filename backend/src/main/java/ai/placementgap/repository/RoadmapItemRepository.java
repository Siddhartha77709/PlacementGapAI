package ai.placementgap.repository;

import ai.placementgap.model.RoadmapItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapItemRepository extends JpaRepository<RoadmapItem, Long> {
    List<RoadmapItem> findByAnalysisIdOrderByItemOrderAsc(Long analysisId);
}
