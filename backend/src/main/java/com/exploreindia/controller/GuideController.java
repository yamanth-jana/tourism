package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.Guide;
import com.exploreindia.entity.GuideRegistration;
import com.exploreindia.repository.GuideRegistrationRepository;
import com.exploreindia.repository.GuideRepository;
import com.exploreindia.repository.UserRepository;
import com.exploreindia.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class GuideController {

    @Autowired
    private GuideRepository guideRepository;

    @Autowired
    private GuideRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/guides")
    public ResponseEntity<ApiResponse<List<Guide>>> getGuides(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String type
    ) {
        if (state != null) {
            return ResponseEntity.ok(ApiResponse.ok(guideRepository.findByStateIdAndVerifiedTrue(state)));
        }
        if (type != null) {
            return ResponseEntity.ok(ApiResponse.ok(guideRepository.findByGuideTypeAndVerifiedTrue(type)));
        }
        return ResponseEntity.ok(ApiResponse.ok(guideRepository.findByVerifiedTrue()));
    }

    @GetMapping("/guides/{id}")
    public ResponseEntity<ApiResponse<Guide>> getGuideById(@PathVariable String id) {
        return guideRepository.findById(id)
                .map(g -> ResponseEntity.ok(ApiResponse.ok(g)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/guide-registrations")
    public ResponseEntity<ApiResponse<GuideRegistration>> submitRegistration(
            @RequestBody GuideRegistration registration,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        registration.setId("gr-" + System.currentTimeMillis());
        registration.setStatus("pending");
        registration.setSubmittedDate(LocalDate.now());

        if (principal != null) {
            userRepository.findById(principal.getId()).ifPresent(registration::setUser);
        }

        GuideRegistration saved = registrationRepository.save(registration);
        return ResponseEntity.ok(ApiResponse.ok("Registration submitted successfully", saved));
    }

    @GetMapping("/guide-registrations/my")
    public ResponseEntity<ApiResponse<List<GuideRegistration>>> getMyRegistrations(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        return ResponseEntity.ok(ApiResponse.ok(registrationRepository.findByUserIdOrderBySubmittedDateDesc(principal.getId())));
    }
}
