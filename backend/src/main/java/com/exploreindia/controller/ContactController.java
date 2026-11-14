package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.ContactMessage;
import com.exploreindia.entity.NewsletterSubscriber;
import com.exploreindia.repository.ContactMessageRepository;
import com.exploreindia.repository.NewsletterSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private NewsletterSubscriberRepository newsletterSubscriberRepository;

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<ContactMessage>> submitContact(@RequestBody ContactMessage message) {
        ContactMessage saved = contactMessageRepository.save(message);
        return ResponseEntity.ok(ApiResponse.ok("Message sent successfully", saved));
    }

    @PostMapping("/newsletter/subscribe")
    public ResponseEntity<ApiResponse<String>> subscribeNewsletter(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Valid email is required"));
        }
        if (newsletterSubscriberRepository.existsByEmail(email)) {
            return ResponseEntity.ok(ApiResponse.ok("Already subscribed", email));
        }

        newsletterSubscriberRepository.save(new NewsletterSubscriber(email));
        return ResponseEntity.ok(ApiResponse.ok("Subscribed successfully", email));
    }
}
