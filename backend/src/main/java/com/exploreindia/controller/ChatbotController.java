package com.exploreindia.controller;

import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.dto.GeneralDTOs.ChatbotRequest;
import com.exploreindia.dto.GeneralDTOs.ChatbotResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatbotResponse>> sendMessage(@RequestBody ChatbotRequest request) {
        String query = request.getMessage() != null ? request.getMessage().toLowerCase() : "";
        String reply;
        List<String> suggestions;

        if (query.contains("taj mahal")) {
            reply = "The Taj Mahal in Agra, Uttar Pradesh is an ivory-white marble mausoleum commissioned in 1632 by Mughal emperor Shah Jahan. Best time to visit is sunrise!";
            suggestions = Arrays.asList("How to reach Taj Mahal?", "Book Taj Mahal Guide", "Explore Agra");
        } else if (query.contains("kerala") || query.contains("munnar")) {
            reply = "Munnar in Kerala is famous for tea plantations, rolling hills, and pleasant climate. Perfect for nature lovers and honeymooners!";
            suggestions = Arrays.asList("Best time to visit Kerala", "Kerala Backwaters", "Plan Kerala Trip");
        } else if (query.contains("guide") || query.contains("book")) {
            reply = "Explore India has certified, experienced guides across all major states. You can book a verified guide directly through our Guides page or during destination booking!";
            suggestions = Arrays.asList("Find local guides", "Become a guide", "My bookings");
        } else if (query.contains("plan") || query.contains("trip")) {
            reply = "You can use our smart Trip Planner wizard to generate personalized day-by-day itineraries tailored to your state, district, and preferred theme!";
            suggestions = Arrays.asList("Open Trip Planner", "Top rated places", "Trending destinations");
        } else {
            reply = "Hello! I am your AI Travel Assistant for Explore India. Ask me about popular destinations, hidden gems, booking guides, or planning your dream journey across India!";
            suggestions = Arrays.asList("Famous Places in Rajasthan", "Hidden Gems in Himachal", "Trip Planner");
        }

        ChatbotResponse response = new ChatbotResponse(reply, suggestions, request.getConversationId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
