package com.exploreindia.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_plans")
public class TripPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "state_id", length = 50)
    private String stateId;

    @Column(name = "district_id", length = 50)
    private String districtId;

    @Column(name = "trip_type_name", length = 100)
    private String tripTypeName;

    @Column(name = "num_days", nullable = false)
    private Integer numDays = 1;

    @Column(name = "total_places")
    private Integer totalPlaces = 0;

    @Column(name = "total_distance", length = 50)
    private String totalDistance;

    @Column(name = "total_travel_time", length = 50)
    private String totalTravelTime;

    @Column(name = "estimated_budget", length = 50)
    private String estimatedBudget;

    @Column(name = "plan_data_json", columnDefinition = "TEXT")
    private String planDataJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public TripPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStateId() { return stateId; }
    public void setStateId(String stateId) { this.stateId = stateId; }

    public String getDistrictId() { return districtId; }
    public void setDistrictId(String districtId) { this.districtId = districtId; }

    public String getTripTypeName() { return tripTypeName; }
    public void setTripTypeName(String tripTypeName) { this.tripTypeName = tripTypeName; }

    public Integer getNumDays() { return numDays; }
    public void setNumDays(Integer numDays) { this.numDays = numDays; }

    public Integer getTotalPlaces() { return totalPlaces; }
    public void setTotalPlaces(Integer totalPlaces) { this.totalPlaces = totalPlaces; }

    public String getTotalDistance() { return totalDistance; }
    public void setTotalDistance(String totalDistance) { this.totalDistance = totalDistance; }

    public String getTotalTravelTime() { return totalTravelTime; }
    public void setTotalTravelTime(String totalTravelTime) { this.totalTravelTime = totalTravelTime; }

    public String getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(String estimatedBudget) { this.estimatedBudget = estimatedBudget; }

    public String getPlanDataJson() { return planDataJson; }
    public void setPlanDataJson(String planDataJson) { this.planDataJson = planDataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
