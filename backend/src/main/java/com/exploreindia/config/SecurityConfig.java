
package com.exploreindia.config;

import com.exploreindia.security.CustomUserDetailsService;
import com.exploreindia.security.JwtAuthenticationFilter;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Authentication provider
    @Bean
    public AuthenticationProvider authenticationProvider(
            CustomUserDetailsService userDetailsService) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // CORS configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("https://tourism-ycdm.vercel.app")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // Spring Security configuration
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(
                    corsConfigurationSource()
            ))

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Swagger endpoints
                .requestMatchers(
                        "/api-docs",
                        "/api-docs/**",
                        "/swagger-ui.html",
                        "/swagger-ui/**"
                ).permitAll()

                // Authentication endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public GET endpoints
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/places/**",
                        "/api/states/**",
                        "/api/districts/**",
                        "/api/categories/**",
                        "/api/search/**",
                        "/api/reviews/**",
                        "/api/guides/**",
                        "/api/health"
                ).permitAll()

                // Public contact and newsletter endpoints
                .requestMatchers(
                        "/api/contact/**",
                        "/api/newsletter/**"
                ).permitAll()

                // User-specific endpoints require authentication
                .requestMatchers(
                        "/api/favorites/**",
                        "/api/notifications/**",
                        "/api/guide-registrations/**"
                ).authenticated()

                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // All remaining endpoints require authentication
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider);

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
}
