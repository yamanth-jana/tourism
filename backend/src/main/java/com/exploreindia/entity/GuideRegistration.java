package com.exploreindia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "guide_registrations")
public class GuideRegistration {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "guide_type", nullable = false, length = 50)
    private String guideType;

    @Column(name = "guide_type_label", length = 100)
    private String guideTypeLabel;

    @Column(length = 150)
    private String organization;

    @Column(nullable = false, length = 30)
    private String mobile;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "experience_years", length = 50)
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String languages;

    @Column(name = "areas_covered", columnDefinition = "TEXT")
    private String areasCovered;

    @Column(length = 150)
    private String specialization;

    @Column(name = "daily_charges", length = 50)
    private String dailyCharges;

    @Column(length = 30)
    private String status = "pending";

    @Column(name = "profile_photo", length = 500)
    private String profilePhoto;

    @Column(name = "admin_comments", columnDefinition = "TEXT")
    private String adminComments;

    @Column(name = "submitted_date")
    private LocalDate submittedDate = LocalDate.now();

    public GuideRegistration() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getGuideType() { return guideType; }
    public void setGuideType(String guideType) { this.guideType = guideType; }

    public String getGuideTypeLabel() { return guideTypeLabel; }
    public void setGuideTypeLabel(String guideTypeLabel) { this.guideTypeLabel = guideTypeLabel; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public String getAreasCovered() { return areasCovered; }
    public void setAreasCovered(String areasCovered) { this.areasCovered = areasCovered; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDailyCharges() { return dailyCharges; }
    public void setDailyCharges(String dailyCharges) { this.dailyCharges = dailyCharges; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getAdminComments() { return adminComments; }
    public void setAdminComments(String adminComments) { this.adminComments = adminComments; }

    public LocalDate getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(LocalDate submittedDate) { this.submittedDate = submittedDate; }
}
