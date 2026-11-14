package com.exploreindia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "place_id", nullable = false, length = 100)
    private String placeId;

    @Column(name = "place_name", nullable = false, length = 150)
    private String placeName;

    @Column(name = "place_image", length = 500)
    private String placeImage;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String district;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "time_slot", nullable = false, length = 30)
    private String timeSlot;

    @Column(nullable = false)
    private Integer visitors = 1;

    @Column(name = "visitor_name", nullable = false, length = 100)
    private String visitorName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(name = "guide_required")
    private Boolean guideRequired = false;

    @Column(name = "guide_name", length = 100)
    private String guideName;

    @Column(length = 50)
    private String language;

    @Column(name = "special_requirements", columnDefinition = "TEXT")
    private String specialRequirements;

    @Column(name = "entry_fee", length = 50)
    private String entryFee;

    @Column(nullable = false, length = 30)
    private String status = "upcoming";

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate = LocalDate.now();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public String getPlaceImage() { return placeImage; }
    public void setPlaceImage(String placeImage) { this.placeImage = placeImage; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public Integer getVisitors() { return visitors; }
    public void setVisitors(Integer visitors) { this.visitors = visitors; }

    public String getVisitorName() { return visitorName; }
    public void setVisitorName(String visitorName) { this.visitorName = visitorName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getGuideRequired() { return guideRequired; }
    public void setGuideRequired(Boolean guideRequired) { this.guideRequired = guideRequired; }

    public String getGuideName() { return guideName; }
    public void setGuideName(String guideName) { this.guideName = guideName; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getSpecialRequirements() { return specialRequirements; }
    public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }

    public String getEntryFee() { return entryFee; }
    public void setEntryFee(String entryFee) { this.entryFee = entryFee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
