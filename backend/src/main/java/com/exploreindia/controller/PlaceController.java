package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.Category;
import com.exploreindia.entity.District;
import com.exploreindia.entity.State;
import com.exploreindia.entity.TouristPlace;
import com.exploreindia.repository.CategoryRepository;
import com.exploreindia.repository.DistrictRepository;
import com.exploreindia.repository.StateRepository;
import com.exploreindia.repository.TouristPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlaceController {

    @Autowired
    private TouristPlaceRepository placeRepository;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/places")
    public ResponseEntity<ApiResponse<Page<TouristPlace>>> getPlaces(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TouristPlace> places = placeRepository.findWithFilters(search, state, district, category, minRating, pageable);
        return ResponseEntity.ok(ApiResponse.ok(places));
    }

    @GetMapping("/places/{id}")
    public ResponseEntity<ApiResponse<TouristPlace>> getPlaceById(@PathVariable String id) {
        return placeRepository.findById(id)
                .map(place -> ResponseEntity.ok(ApiResponse.ok(place)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/states")
    public ResponseEntity<ApiResponse<List<State>>> getStates() {
        return ResponseEntity.ok(ApiResponse.ok(stateRepository.findAllByOrderByNameAsc()));
    }

    @GetMapping("/states/{stateId}/districts")
    public ResponseEntity<ApiResponse<List<District>>> getDistrictsByState(@PathVariable String stateId) {
        return ResponseEntity.ok(ApiResponse.ok(districtRepository.findByStateIdOrderByNameAsc(stateId)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryRepository.findAll()));
    }
}
