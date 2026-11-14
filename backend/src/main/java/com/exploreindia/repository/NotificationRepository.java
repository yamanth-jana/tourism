package com.exploreindia.repository;

import com.exploreindia.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByAudienceOrderByCreatedAtDesc(String audience);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
