package com.exploreindia.controller;

import com.exploreindia.dto.BookingDTOs.BookingRequest;
import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.Booking;
import com.exploreindia.entity.User;
import com.exploreindia.repository.BookingRepository;
import com.exploreindia.repository.UserRepository;
import com.exploreindia.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (request.getVisitDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Visit date cannot be in the past"));
        }

        Booking booking = new Booking();
        String uniqueId = "BK-" + LocalDate.now().getYear() + "-" + (int)(Math.random() * 900 + 100);
        booking.setId(uniqueId);
        booking.setPlaceId(request.getPlaceId());
        booking.setPlaceName(request.getPlaceName());
        booking.setPlaceImage(request.getPlaceImage());
        booking.setState(request.getState());
        booking.setDistrict(request.getDistrict());
        booking.setVisitDate(request.getVisitDate());
        booking.setTimeSlot(request.getTimeSlot());
        booking.setVisitors(request.getVisitors());
        booking.setVisitorName(request.getVisitorName());
        booking.setEmail(request.getEmail());
        booking.setPhone(request.getPhone());
        booking.setGuideRequired(request.getGuideRequired());
        booking.setGuideName(request.getGuideName());
        booking.setLanguage(request.getLanguage());
        booking.setSpecialRequirements(request.getSpecialRequirements());
        booking.setEntryFee(request.getEntryFee());
        booking.setStatus("upcoming");
        booking.setBookingDate(LocalDate.now());

        if (principal != null) {
            userRepository.findById(principal.getId()).ifPresent(booking::setUser);
        }

        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(ApiResponse.ok("Booking confirmed", saved));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return bookingRepository.findById(id)
                .map(b -> ResponseEntity.ok(ApiResponse.ok(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return bookingRepository.findById(id)
                .map(b -> {
                    if ("completed".equalsIgnoreCase(b.getStatus())) {
                        return ResponseEntity.badRequest().body(ApiResponse.<Booking>error("Completed booking cannot be cancelled"));
                    }
                    b.setStatus("cancelled");
                    Booking updated = bookingRepository.save(b);
                    return ResponseEntity.ok(ApiResponse.ok("Booking cancelled", updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
