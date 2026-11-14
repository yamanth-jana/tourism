package com.exploreindia.repository;

import com.exploreindia.entity.TouristPlace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TouristPlaceRepository extends JpaRepository<TouristPlace, String>, JpaSpecificationExecutor<TouristPlace> {

    List<TouristPlace> findByStateId(String stateId);
    List<TouristPlace> findByCategoryId(String categoryId);
    List<TouristPlace> findByTrendingTrue();
    List<TouristPlace> findByTopRatedTrue();
    List<TouristPlace> findByHiddenTrue();

    @Query("SELECT p FROM TouristPlace p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.city) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:stateId IS NULL OR p.state.id = :stateId) AND " +
           "(:districtId IS NULL OR (p.district IS NOT NULL AND p.district.id = :districtId)) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating)")
    Page<TouristPlace> findWithFilters(
            @Param("search") String search,
            @Param("stateId") String stateId,
            @Param("districtId") String districtId,
            @Param("categoryId") String categoryId,
            @Param("minRating") Double minRating,
            Pageable pageable
    );
}
