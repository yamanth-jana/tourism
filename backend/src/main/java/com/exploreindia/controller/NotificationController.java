package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.Notification;
import com.exploreindia.repository.NotificationRepository;
import com.exploreindia.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(@AuthenticationPrincipal UserPrincipal principal) {
        String audience = (principal != null && "ADMIN".equalsIgnoreCase(principal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")))
                ? "admin" : "user";
        List<Notification> notifications = notificationRepository.findByAudienceOrderByCreatedAtDesc(audience);
        return ResponseEntity.ok(ApiResponse.ok(notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable String id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok(ApiResponse.ok("Marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserPrincipal principal) {
        String audience = (principal != null && "ADMIN".equalsIgnoreCase(principal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")))
                ? "admin" : "user";
        List<Notification> notifications = notificationRepository.findByAudienceOrderByCreatedAtDesc(audience);
        for (Notification n : notifications) {
            n.setRead(true);
            notificationRepository.save(n);
        }
        return ResponseEntity.ok(ApiResponse.ok("All marked as read", null));
    }
}
