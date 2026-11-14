package com.exploreindia.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "guides")
public class Guide {

    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "state_id", length = 50)
    private String stateId;

    @Column(name = "district_id", length = 50)
    private String districtId;

    @Column(name = "experience_years")
    private Integer experienceYears = 1;

    private Double rating = 4.8;

    @Column(name = "reviews_count")
    private Integer reviewsCount = 0;

    @Column(name = "guide_type", length = 50)
    private String guideType = "FREELANCE";

    @Column(length = 150)
    private String specialization;

    @Column(name = "daily_rate")
    private Double dailyRate = 1500.0;

    @Column(length = 255)
    private String languages;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_verified")
    private Boolean verified = true;

    public Guide() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getStateId() { return stateId; }
    public void setStateId(String stateId) { this.stateId = stateId; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public String getGuideType() { return guideType; }
    public void setGuideType(String guideType) { this.guideType = guideType; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
}
