package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.Favorite;
import com.exploreindia.entity.TouristPlace;
import com.exploreindia.entity.User;
import com.exploreindia.repository.FavoriteRepository;
import com.exploreindia.repository.TouristPlaceRepository;
import com.exploreindia.repository.UserRepository;
import com.exploreindia.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private TouristPlaceRepository placeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<String>>> getFavorites(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        List<Favorite> favorites = favoriteRepository.findByUserId(principal.getId());
        List<String> placeIds = favorites.stream().map(f -> f.getPlace().getId()).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(placeIds));
    }

    @PostMapping("/{placeId}")
    public ResponseEntity<ApiResponse<Void>> addFavorite(
            @PathVariable String placeId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        if (favoriteRepository.existsByUserIdAndPlaceId(principal.getId(), placeId)) {
            return ResponseEntity.ok(ApiResponse.ok("Already favorited", null));
        }

        User user = userRepository.findById(principal.getId()).orElse(null);
        TouristPlace place = placeRepository.findById(placeId).orElse(null);

        if (user == null || place == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("User or place not found"));
        }

        favoriteRepository.save(new Favorite(user, place));
        return ResponseEntity.ok(ApiResponse.ok("Added to favorites", null));
    }

    @DeleteMapping("/{placeId}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable String placeId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        favoriteRepository.deleteByUserIdAndPlaceId(principal.getId(), placeId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from favorites", null));
    }
}
