-- CREATE TABLE users (
--     user_id SERIAL PRIMARY KEY UNIQUE,
--     username VARCHAR(40) NOT NULL UNIQUE,
--     email VARCHAR(40)  NOT NULL UNIQUE,
--     password_hash VARCHAR(40) NOT NULL,
--     bio TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE videos (
--     video_id SERIAL PRIMARY KEY UNIQUE,
--     video_url VARCHAR(255) NOT NULL,
--     thumbnail_url VARCHAR(255),
--     title VARCHAR(255),
--     description TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     user_id INT NOT NULL REFERENCES users(user_id)
-- );

-- CREATE TABLE video_likes (
--     like_id SERIAL PRIMARY KEY,
--     video_id INT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
--     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT unique_video_user_like UNIQUE (video_id, user_id) -- Ensure a user can like a video only once
-- );

-- CREATE TABLE video_comments (
--     comment_id SERIAL PRIMARY KEY,
--     video_id INT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
--     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
--     comment_text TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE video_flags (
--     flag_id SERIAL PRIMARY KEY,
--     video_id INT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
--     product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
--     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE video_comments (
--     comment_id SERIAL PRIMARY KEY,
--     video_id INT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
--     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
--     comment_text TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE video_saves (
--     save_id SERIAL PRIMARY KEY,
--     video_id INT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
--     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE shops (
--     shop_id SERIAL PRIMARY KEY,
--     title VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     sold_count INT DEFAULT 0,
--     response_rate INT DEFAULT 0,
--     shipped_on_time_rate INT DEFAULT 0,
--     owner_id INT NOT NULL REFERENCES users(user_id)
-- );

-- CREATE TABLE products (
--     product_id SERIAL PRIMARY KEY,
--     shop_id INT NOT NULL REFERENCES shops(shop_id) ON DELETE CASCADE,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     price DECIMAL(10, 2) NOT NULL,
--     stock INT,
--     image_url VARCHAR(255),
--     sold_count INT DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- -- Create the tags table to store tags information
-- CREATE TABLE tags (
--     tag_id SERIAL PRIMARY KEY,
--     tag_name VARCHAR(50) NOT NULL UNIQUE
-- );

-- -- Create the product_tags table to associate tags with products
-- CREATE TABLE product_tags (
--     product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
--     tag_id INT NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
--     PRIMARY KEY (product_id, tag_id)
-- );

-- -- Create the product_reviews table to store reviews of products
-- CREATE TABLE product_reviews (
--     review_id SERIAL PRIMARY KEY,
--     product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
--     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
--     review_text TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Create the product_ratings table to store ratings for products
-- CREATE TABLE product_ratings (
--     rating_id SERIAL PRIMARY KEY,
--     product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
--     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
--     rating INT CHECK (rating >= 1 AND rating <= 5),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT unique_product_user_rating UNIQUE (product_id, user_id) -- Ensure a user can rate a product only once
-- );