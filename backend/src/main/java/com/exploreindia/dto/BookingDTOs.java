package com.exploreindia.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingDTOs {

    public static class BookingRequest {
        @NotBlank(message = "Place ID is required")
        private String placeId;

        private String placeName;
        private String placeImage;
        private String state;
        private String district;

        @NotNull(message = "Visit date is required")
        private LocalDate visitDate;

        @NotBlank(message = "Time slot is required")
        private String timeSlot;

        @Min(value = 1, message = "At least 1 visitor is required")
        private Integer visitors = 1;

        @NotBlank(message = "Visitor name is required")
        private String visitorName;

        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Phone number is required")
        private String phone;

        private Boolean guideRequired = false;
        private String guideName;
        private String language;
        private String specialRequirements;
        private String entryFee;

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
    }
}
