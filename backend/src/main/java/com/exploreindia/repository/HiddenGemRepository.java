package com.exploreindia.repository;

import com.exploreindia.entity.HiddenGem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiddenGemRepository extends JpaRepository<HiddenGem, String> {
    List<HiddenGem> findByStatus(String status);
    List<HiddenGem> findByStateIdAndStatus(String stateId, String status);
    long countByStatus(String status);
}
