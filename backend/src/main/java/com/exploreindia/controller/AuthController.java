package com.exploreindia.controller;

import com.exploreindia.dto.AuthDTOs.*;
import com.exploreindia.dto.GeneralDTOs.ApiResponse;
import com.exploreindia.entity.User;
import com.exploreindia.repository.UserRepository;
import com.exploreindia.security.JwtTokenProvider;
import com.exploreindia.security.UserPrincipal;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail().toLowerCase().trim())
                .orElse(null);


        // Verify user and password
        if (user == null ||
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                        ApiResponse.error(
                            "Invalid email or password"
                        )
                    );
        }


        // Check account status
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                        ApiResponse.error(
                            "Your account is currently "
                            + user.getStatus().toLowerCase()
                            + ". Please contact support."
                        )
                    );
        }


        // Enforce the selected login mode on the server. A valid admin
        // account must not be able to sign in through the normal user form.
        String requestedRole = request.getRole();
        String actualRole = user.getRole();

        if ("admin".equalsIgnoreCase(requestedRole)
                && !"ADMIN".equalsIgnoreCase(actualRole)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(
                            "Access denied: Administrator privileges required. Please use a user account."));
        }

        if ("user".equalsIgnoreCase(requestedRole)
                && "ADMIN".equalsIgnoreCase(actualRole)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(
                            "This is an administrator account. Please select Admin Login."));
        }


        // Generate JWT
        String token =
                tokenProvider.generateTokenFromEmail(
                        user.getEmail(),
                        user.getId(),
                        user.getRole()
                );


        AuthResponse authResponse =
                new AuthResponse(
                        token,
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getRole(),
                        user.getAvatarUrl()
                );


        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Login successful",
                        authResponse
                )
        );
    }


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        String normalizedEmail =
                request.getEmail().toLowerCase().trim();


        // Check duplicate email
        if (userRepository.existsByEmail(normalizedEmail)) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        ApiResponse.error(
                            "Email is already registered. "
                            + "Please log in or use another email."
                        )
                    );
        }


        // Create new user
        User user = new User();

        user.setEmail(normalizedEmail);

        user.setFullName(
                request.getName().trim()
        );

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setPhone(
                request.getPhone() != null
                        ? request.getPhone().trim()
                        : null
        );

        // Always create normal users through registration
        user.setRole("USER");

        user.setStatus("ACTIVE");


        // Save to database
        User savedUser =
                userRepository.save(user);


        // Generate JWT
        String token =
                tokenProvider.generateTokenFromEmail(
                        savedUser.getEmail(),
                        savedUser.getId(),
                        savedUser.getRole()
                );


        AuthResponse authResponse =
                new AuthResponse(
                        token,
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getFullName(),
                        savedUser.getRole(),
                        savedUser.getAvatarUrl()
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    ApiResponse.ok(
                        "Registration successful",
                        authResponse
                    )
                );
    }


    // =========================================================
    // CURRENT USER
    // =========================================================

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {


        // JWT authentication failed
        if (principal == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                        ApiResponse.error(
                            "Unauthorized: Session expired or invalid token"
                        )
                    );
        }


        // Find user in database
        User user =
                userRepository
                        .findById(principal.getId())
                        .orElse(null);


        // User no longer exists
        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                        ApiResponse.error(
                            "User account not found"
                        )
                    );
        }


        // IMPORTANT:
        // Do NOT return the User entity directly.
        // It contains passwordHash.
        UserResponse response =
                new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getPhone(),
                        user.getAvatarUrl(),
                        user.getRole(),
                        user.getStatus()
                );


        return ResponseEntity.ok(
                ApiResponse.ok(response)
        );
    }
}