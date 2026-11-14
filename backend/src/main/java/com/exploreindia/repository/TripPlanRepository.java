package com.exploreindia.repository;

import com.exploreindia.entity.TripPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripPlanRepository extends JpaRepository<TripPlan, Long> {
    List<TripPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
}
