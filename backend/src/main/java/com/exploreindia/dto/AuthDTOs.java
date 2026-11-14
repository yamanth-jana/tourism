package com.exploreindia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTOs {

    // =========================================================
    // LOGIN REQUEST
    // =========================================================

    public static class LoginRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String role; // optional: user or admin


        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }


    // =========================================================
    // REGISTER REQUEST
    // =========================================================

    public static class RegisterRequest {

        @NotBlank(message = "Full name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 4, message = "Password must be at least 4 characters")
        private String password;

        private String phone;

        private String role = "USER";


        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }


    // =========================================================
    // AUTH RESPONSE
    // =========================================================

    public static class AuthResponse {

        private String token;
        private Long id;
        private String email;
        private String name;
        private String role;
        private String photo;


        public AuthResponse(
                String token,
                Long id,
                String email,
                String name,
                String role,
                String photo) {

            this.token = token;
            this.id = id;
            this.email = email;
            this.name = name;
            this.role = role;
            this.photo = photo;
        }


        public String getToken() {
            return token;
        }

        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }

        public String getRole() {
            return role;
        }

        public String getPhoto() {
            return photo;
        }
    }


    // =========================================================
    // SAFE USER RESPONSE
    // =========================================================
    // IMPORTANT:
    // This class does NOT contain passwordHash.
    // It is used by /api/auth/me.
    // =========================================================

    public static class UserResponse {

        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String role;
        private String status;


        public UserResponse(
                Long id,
                String email,
                String fullName,
                String phone,
                String avatarUrl,
                String role,
                String status) {

            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.phone = phone;
            this.avatarUrl = avatarUrl;
            this.role = role;
            this.status = status;
        }


        public Long getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getFullName() {
            return fullName;
        }

        public String getPhone() {
            return phone;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public String getRole() {
            return role;
        }

        public String getStatus() {
            return status;
        }
    }
}