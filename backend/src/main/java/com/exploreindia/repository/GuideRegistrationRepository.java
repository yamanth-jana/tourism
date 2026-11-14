package com.exploreindia.repository;

import com.exploreindia.entity.GuideRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuideRegistrationRepository extends JpaRepository<GuideRegistration, String> {
    List<GuideRegistration> findByStatusOrderBySubmittedDateDesc(String status);
    List<GuideRegistration> findByUserIdOrderBySubmittedDateDesc(Long userId);
    long countByStatus(String status);
}
