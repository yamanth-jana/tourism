package com.exploreindia.repository;

import com.exploreindia.entity.PlaceSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceSubmissionRepository extends JpaRepository<PlaceSubmission, Long> {
    List<PlaceSubmission> findByStatusOrderByCreatedAtDesc(String status);
    List<PlaceSubmission> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByStatus(String status);
}
