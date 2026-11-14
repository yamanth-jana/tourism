package com.exploreindia.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "states")
public class State {

    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String capital;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "popular_for", length = 255)
    private String popularFor;

    public State() {}

    public State(String id, String name, String capital) {
        this.id = id;
        this.name = name;
        this.capital = capital;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCapital() { return capital; }
    public void setCapital(String capital) { this.capital = capital; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPopularFor() { return popularFor; }
    public void setPopularFor(String popularFor) { this.popularFor = popularFor; }
}
