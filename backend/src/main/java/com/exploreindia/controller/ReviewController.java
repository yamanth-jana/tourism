package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.Review;
import com.exploreindia.entity.TouristPlace;
import com.exploreindia.repository.ReviewRepository;
import com.exploreindia.repository.TouristPlaceRepository;
import com.exploreindia.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TouristPlaceRepository placeRepository;

    @GetMapping("/places/{placeId}/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getReviewsByPlace(@PathVariable String placeId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewRepository.findByPlaceIdOrderByCreatedAtDesc(placeId)));
    }

    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.ok(reviewRepository.findAllByOrderByCreatedAtDesc()));
    }

    @PostMapping("/places/{placeId}/reviews")
    public ResponseEntity<ApiResponse<Review>> addReview(
            @PathVariable String placeId,
            @RequestBody Review review,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        TouristPlace place = placeRepository.findById(placeId).orElse(null);
        if (place == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Place not found"));
        }

        review.setId("rev-" + UUID.randomUUID().toString().substring(0, 8));
        review.setPlace(place);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        if (principal != null) {
            review.setUserName(principal.getUsername());
        }

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(ApiResponse.ok("Review added", saved));
    }

    @PostMapping("/reviews/{id}/helpful")
    public ResponseEntity<ApiResponse<Integer>> markHelpful(@PathVariable String id) {
        return reviewRepository.findById(id)
                .map(r -> {
                    r.setHelpfulCount(r.getHelpfulCount() + 1);
                    reviewRepository.save(r);
                    return ResponseEntity.ok(ApiResponse.ok("Helpful count updated", r.getHelpfulCount()));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
