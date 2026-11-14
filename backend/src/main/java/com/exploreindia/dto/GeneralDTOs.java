package com.exploreindia.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class GeneralDTOs {

    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;
        private LocalDateTime timestamp = LocalDateTime.now();

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public static <T> ApiResponse<T> ok(String message, T data) {
            return new ApiResponse<>(true, message, data);
        }

        public static <T> ApiResponse<T> ok(T data) {
            return new ApiResponse<>(true, "Success", data);
        }

        public static <T> ApiResponse<T> error(String message) {
            return new ApiResponse<>(false, message, null);
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public T getData() { return data; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }

    public static class DashboardStatsResponse {
        private long totalUsers;
        private long totalTouristPlaces;
        private long pendingUploads;
        private long totalReports;
        private long totalReviews;
        private long totalHiddenGems;
        private long totalBookings;
        private long upcomingBookings;
        private long verifiedGuides;
        private long pendingGuideApplications;
        private double monthlyGrowth;
        private long activeUsers;

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getTotalTouristPlaces() { return totalTouristPlaces; }
        public void setTotalTouristPlaces(long totalTouristPlaces) { this.totalTouristPlaces = totalTouristPlaces; }
        public long getPendingUploads() { return pendingUploads; }
        public void setPendingUploads(long pendingUploads) { this.pendingUploads = pendingUploads; }
        public long getTotalReports() { return totalReports; }
        public void setTotalReports(long totalReports) { this.totalReports = totalReports; }
        public long getTotalReviews() { return totalReviews; }
        public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }
        public long getTotalHiddenGems() { return totalHiddenGems; }
        public void setTotalHiddenGems(long totalHiddenGems) { this.totalHiddenGems = totalHiddenGems; }
        public long getTotalBookings() { return totalBookings; }
        public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
        public long getUpcomingBookings() { return upcomingBookings; }
        public void setUpcomingBookings(long upcomingBookings) { this.upcomingBookings = upcomingBookings; }
        public long getVerifiedGuides() { return verifiedGuides; }
        public void setVerifiedGuides(long verifiedGuides) { this.verifiedGuides = verifiedGuides; }
        public long getPendingGuideApplications() { return pendingGuideApplications; }
        public void setPendingGuideApplications(long pendingGuideApplications) { this.pendingGuideApplications = pendingGuideApplications; }
        public double getMonthlyGrowth() { return monthlyGrowth; }
        public void setMonthlyGrowth(double monthlyGrowth) { this.monthlyGrowth = monthlyGrowth; }
        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    }

    public static class ChatbotRequest {
        private String message;
        private String conversationId;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getConversationId() { return conversationId; }
        public void setConversationId(String conversationId) { this.conversationId = conversationId; }
    }

    public static class ChatbotResponse {
        private String reply;
        private List<String> suggestions;
        private String conversationId;

        public ChatbotResponse(String reply, List<String> suggestions, String conversationId) {
            this.reply = reply;
            this.suggestions = suggestions;
            this.conversationId = conversationId;
        }

        public String getReply() { return reply; }
        public List<String> getSuggestions() { return suggestions; }
        public String getConversationId() { return conversationId; }
    }
}
