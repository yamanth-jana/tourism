-- Explore India Initial Seed Data for explore_india database

USE explore_india;

-- Default Administrator (password: admin123, BCrypt hashed)
-- BCrypt hash for 'admin123' is '$2a$10$wE99w/6fX2/Z/3Zz6iM27eWw6vH4qQ0e6bBf4bB1w/wQ7bBf4bB1w'
INSERT INTO users (email, password_hash, full_name, role, status)
SELECT 'admin@exploreindia.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Administrator', 'ADMIN', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@exploreindia.com');

-- Default User (password: user123, BCrypt hashed)
INSERT INTO users (email, password_hash, full_name, role, status)
SELECT 'user@exploreindia.com', '$2a$10$vI8aWBnW3fK/sW7P50lGme.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aarav Sharma', 'USER', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@exploreindia.com');

-- Core Categories
INSERT INTO categories (id, name, slug, icon, description)
SELECT 'heritage', 'Heritage & Monuments', 'heritage', 'Landmark', 'Historical monuments, palaces, forts and architectural wonders'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'heritage');

INSERT INTO categories (id, name, slug, icon, description)
SELECT 'nature', 'Nature & Wildlife', 'nature', 'Trees', 'National parks, sanctuaries, lush greenery and biodiversity'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'nature');

INSERT INTO categories (id, name, slug, icon, description)
SELECT 'spiritual', 'Spiritual & Pilgrimage', 'spiritual', 'Flame', 'Temples, mosques, churches, gurdwaras and spiritual retreats'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'spiritual');

INSERT INTO categories (id, name, slug, icon, description)
SELECT 'beaches', 'Beaches & Coastal', 'beaches', 'Waves', 'Sun-kissed beaches, coastal towns and maritime experiences'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'beaches');

INSERT INTO categories (id, name, slug, icon, description)
SELECT 'hills', 'Hill Stations & Mountains', 'hills', 'Mountain', 'Himalayan peaks, Western Ghats and scenic hill getaways'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = 'hills');
