package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.dto.GeneralDTOs.DashboardStatsResponse;
import com.exploreindia.entity.*;
import com.exploreindia.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TouristPlaceRepository placeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private GuideRepository guideRepository;

    @Autowired
    private GuideRegistrationRepository guideRegistrationRepository;

    @Autowired
    private HiddenGemRepository hiddenGemRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PlaceSubmissionRepository placeSubmissionRepository;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalTouristPlaces(placeRepository.count());
        stats.setPendingUploads(placeSubmissionRepository.countByStatus("PENDING"));
        stats.setTotalReports(reportRepository.count());
        stats.setTotalReviews(reviewRepository.count());
        stats.setTotalHiddenGems(hiddenGemRepository.count());
        stats.setTotalBookings(bookingRepository.count());
        stats.setUpcomingBookings(bookingRepository.countByStatus("upcoming"));
        stats.setVerifiedGuides(guideRepository.countByVerifiedTrue());
        stats.setPendingGuideApplications(guideRegistrationRepository.countByStatus("pending"));
        stats.setMonthlyGrowth(12.5);
        stats.setActiveUsers(userRepository.countByRole("USER"));

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok(bookingRepository.findAll()));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String newStatus = body.get("status");
        return bookingRepository.findById(id)
                .map(b -> {
                    b.setStatus(newStatus);
                    Booking saved = bookingRepository.save(b);
                    return ResponseEntity.ok(ApiResponse.ok("Status updated", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/guide-registrations")
    public ResponseEntity<ApiResponse<List<GuideRegistration>>> getGuideRegistrations() {
        return ResponseEntity.ok(ApiResponse.ok(guideRegistrationRepository.findAll()));
    }

    @PutMapping("/guide-registrations/{id}/status")
    public ResponseEntity<ApiResponse<GuideRegistration>> updateGuideRegistrationStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String newStatus = body.get("status");
        String comments = body.get("adminComments");

        return guideRegistrationRepository.findById(id)
                .map(r -> {
                    r.setStatus(newStatus);
                    if (comments != null) r.setAdminComments(comments);
                    GuideRegistration saved = guideRegistrationRepository.save(r);

                    // If verified, ensure guide profile exists in guides table
                    if ("verified".equalsIgnoreCase(newStatus)) {
                        Guide g = new Guide();
                        g.setId("g-" + r.getId());
                        g.setFullName(r.getFullName());
                        g.setPhotoUrl(r.getProfilePhoto());
                        g.setGuideType(r.getGuideType());
                        g.setLanguages(r.getLanguages());
                        g.setSpecialization(r.getSpecialization());
                        g.setPhone(r.getMobile());
                        g.setEmail(r.getEmail());
                        g.setVerified(true);
                        guideRepository.save(g);
                    }

                    return ResponseEntity.ok(ApiResponse.ok("Registration status updated", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<Report>>> getReports() {
        return ResponseEntity.ok(ApiResponse.ok(reportRepository.findAll()));
    }

    @PutMapping("/reports/{id}/status")
    public ResponseEntity<ApiResponse<Report>> updateReportStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return reportRepository.findById(id)
                .map(r -> {
                    r.setStatus(body.get("status"));
                    r.setResolvedAt(LocalDateTime.now());
                    return ResponseEntity.ok(ApiResponse.ok("Report status updated", reportRepository.save(r)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/place-submissions")
    public ResponseEntity<ApiResponse<List<PlaceSubmission>>> getPlaceSubmissions() {
        return ResponseEntity.ok(ApiResponse.ok(placeSubmissionRepository.findAll()));
    }

    @PutMapping("/place-submissions/{id}/status")
    public ResponseEntity<ApiResponse<PlaceSubmission>> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return placeSubmissionRepository.findById(id)
                .map(s -> {
                    s.setStatus(body.get("status"));
                    return ResponseEntity.ok(ApiResponse.ok("Submission status updated", placeSubmissionRepository.save(s)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.ok(userRepository.findAll()));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return userRepository.findById(id)
                .map(u -> {
                    u.setStatus(body.get("status"));
                    return ResponseEntity.ok(ApiResponse.ok("User status updated", userRepository.save(u)));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
