package com.exploreindia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, String>> checkHealth() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Explore India Backend");
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }
}
