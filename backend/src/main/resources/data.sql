-- Explore India Initial Seed Data for explore_india database

USE explore_india;

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
