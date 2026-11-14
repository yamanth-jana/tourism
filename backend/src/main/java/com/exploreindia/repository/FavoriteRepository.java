package com.exploreindia.repository;

import com.exploreindia.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndPlaceId(Long userId, String placeId);
    boolean existsByUserIdAndPlaceId(Long userId, String placeId);
    void deleteByUserIdAndPlaceId(Long userId, String placeId);
}
