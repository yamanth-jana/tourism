-- Explore India MySQL 8+ / MariaDB Database Schema

CREATE DATABASE IF NOT EXISTS explore_india CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE explore_india;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
);

-- 2. States Table
CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100),
    image_url VARCHAR(500),
    banner_url VARCHAR(500),
    description TEXT,
    popular_for VARCHAR(255)
);

-- 3. Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_id VARCHAR(50) NOT NULL,
    headquarter VARCHAR(100),
    description TEXT,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE,
    INDEX idx_district_state (state_id)
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500)
);

-- 5. Tourist Places Table
CREATE TABLE IF NOT EXISTS tourist_places (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    state_id VARCHAR(50) NOT NULL,
    district_id VARCHAR(50),
    category_id VARCHAR(50) NOT NULL,
    city VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 4.5,
    reviews_count INT DEFAULT 0,
    image_url VARCHAR(500) NOT NULL,
    short_description VARCHAR(500),
    full_description TEXT,
    history TEXT,
    cultural_importance TEXT,
    best_time_to_visit VARCHAR(100),
    entry_fee VARCHAR(100),
    timings VARCHAR(100),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    is_trending BOOLEAN DEFAULT FALSE,
    is_top_rated BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_place_state (state_id),
    INDEX idx_place_category (category_id),
    INDEX idx_place_rating (rating)
);

-- 6. Place Gallery Images
CREATE TABLE IF NOT EXISTS place_gallery_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (place_id) REFERENCES tourist_places(id) ON DELETE CASCADE
);

-- 7. Hidden Gems Table
CREATE TABLE IF NOT EXISTS hidden_gems (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    state_id VARCHAR(50) NOT NULL,
    district_id VARCHAR(50),
    category_id VARCHAR(50),
    image_url VARCHAR(500) NOT NULL,
    description TEXT,
    submitted_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'APPROVED',
    upvotes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id),
    INDEX idx_gem_status (status)
);

-- 8. Favorites Table (Unique constraint: user + place)
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    place_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_place (user_id, place_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES tourist_places(id) ON DELETE CASCADE
);

-- 9. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    place_id VARCHAR(100) NOT NULL,
    user_id BIGINT,
    user_name VARCHAR(100) NOT NULL,
    user_avatar VARCHAR(500),
    rating DECIMAL(2,1) NOT NULL,
    title VARCHAR(200),
    comment TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES tourist_places(id) ON DELETE CASCADE,
    INDEX idx_review_place (place_id)
);

-- 10. Review Helpful Upvotes Table
CREATE TABLE IF NOT EXISTS review_helpful (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    review_id VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_review_user (review_id, user_id),
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. Guides Table
CREATE TABLE IF NOT EXISTS guides (
    id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    photo_url VARCHAR(500),
    state_id VARCHAR(50),
    district_id VARCHAR(50),
    experience_years INT DEFAULT 1,
    rating DECIMAL(2,1) DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    guide_type VARCHAR(50) DEFAULT 'FREELANCE',
    specialization VARCHAR(150),
    daily_rate DECIMAL(10,2) DEFAULT 1500.00,
    languages VARCHAR(255),
    phone VARCHAR(30),
    email VARCHAR(150),
    bio TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (state_id) REFERENCES states(id),
    INDEX idx_guide_state (state_id)
);

-- 12. Guide Registrations Table
CREATE TABLE IF NOT EXISTS guide_registrations (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT,
    full_name VARCHAR(100) NOT NULL,
    guide_type VARCHAR(50) NOT NULL,
    guide_type_label VARCHAR(100),
    organization VARCHAR(150),
    mobile VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    experience_years VARCHAR(50),
    languages TEXT,
    areas_covered TEXT,
    specialization VARCHAR(150),
    daily_charges VARCHAR(50),
    status VARCHAR(30) DEFAULT 'PENDING',
    profile_photo VARCHAR(500),
    admin_comments TEXT,
    submitted_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_reg_status (status)
);

-- 13. Guide Documents Table
CREATE TABLE IF NOT EXISTS guide_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    registration_id VARCHAR(50) NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    FOREIGN KEY (registration_id) REFERENCES guide_registrations(id) ON DELETE CASCADE
);

-- 14. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT,
    place_id VARCHAR(100) NOT NULL,
    place_name VARCHAR(150) NOT NULL,
    place_image VARCHAR(500),
    state VARCHAR(100),
    district VARCHAR(100),
    visit_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    visitors INT NOT NULL DEFAULT 1,
    visitor_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    guide_required BOOLEAN DEFAULT FALSE,
    guide_name VARCHAR(100),
    language VARCHAR(50),
    special_requirements TEXT,
    entry_fee VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'upcoming',
    booking_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_booking_user (user_id),
    INDEX idx_booking_status (status)
);

-- 15. Booking Status History Table
CREATE TABLE IF NOT EXISTS booking_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(100),
    reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 16. Trip Plans Table
CREATE TABLE IF NOT EXISTS trip_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    state_id VARCHAR(50),
    district_id VARCHAR(50),
    trip_type_name VARCHAR(100),
    num_days INT NOT NULL DEFAULT 1,
    total_places INT DEFAULT 0,
    total_distance VARCHAR(50),
    total_travel_time VARCHAR(50),
    estimated_budget VARCHAR(50),
    plan_data_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 17. Place Submissions Table (Upload Place)
CREATE TABLE IF NOT EXISTS place_submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    history TEXT,
    best_time VARCHAR(100),
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 18. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    place_id VARCHAR(100),
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 19. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT,
    audience VARCHAR(20) DEFAULT 'user',
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 20. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
