package com.exploreindia.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hidden_gems")
public class HiddenGem {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    @Column(name = "district_id", length = 50)
    private String district;

    @Column(name = "category_id", length = 50)
    private String category;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "submitted_by", length = 100)
    private String submittedBy;

    @Column(length = 20)
    private String status = "APPROVED";

    @Column(name = "upvotes_count")
    private Integer upvotesCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public HiddenGem() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public State getState() { return state; }
    public void setState(State state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(String submittedBy) { this.submittedBy = submittedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getUpvotesCount() { return upvotesCount; }
    public void setUpvotesCount(Integer upvotesCount) { this.upvotesCount = upvotesCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
