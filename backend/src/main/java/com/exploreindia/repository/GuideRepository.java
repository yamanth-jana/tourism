package com.exploreindia.repository;

import com.exploreindia.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideRepository extends JpaRepository<Guide, String> {
    List<Guide> findByVerifiedTrue();
    List<Guide> findByStateIdAndVerifiedTrue(String stateId);
    List<Guide> findByGuideTypeAndVerifiedTrue(String guideType);
    long countByVerifiedTrue();
}
