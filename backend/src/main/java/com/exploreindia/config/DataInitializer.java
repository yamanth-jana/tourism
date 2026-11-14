package com.exploreindia.config;

import com.exploreindia.entity.User;
import com.exploreindia.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public void run(String... args) throws Exception {

        // Ensure default administrator exists in database
        if (!userRepository.existsByEmail("admin@exploreindia.com")) {

            User admin = new User();

            admin.setEmail("admin@exploreindia.com");
            admin.setFullName("Administrator");
            admin.setPasswordHash(
                passwordEncoder.encode("admin123")
            );
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            admin.setAvatarUrl(
                "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200"
            );

            userRepository.save(admin);
        }

        // Ensure default demo user exists in database
        if (!userRepository.existsByEmail("user@exploreindia.com")) {

            User user = new User();

            user.setEmail("user@exploreindia.com");
            user.setFullName("Aarav Sharma");
            user.setPasswordHash(
                passwordEncoder.encode("user123")
            );
            user.setRole("USER");
            user.setStatus("ACTIVE");
            user.setAvatarUrl(
                "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200"
            );

            userRepository.save(user);
        }
    }
}