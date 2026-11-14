package com.exploreindia.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscribers")
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "subscribed_at", updatable = false)
    private LocalDateTime subscribedAt = LocalDateTime.now();

    @Column(name = "is_active")
    private Boolean active = true;

    public NewsletterSubscriber() {}

    public NewsletterSubscriber(String email) {
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getSubscribedAt() { return subscribedAt; }
    public void setSubscribedAt(LocalDateTime subscribedAt) { this.subscribedAt = subscribedAt; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
