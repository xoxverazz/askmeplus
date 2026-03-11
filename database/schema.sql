-- ASKME+ Database Schema
CREATE DATABASE IF NOT EXISTS askmeplus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE askmeplus;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(500) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    allow_messages BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    device_type VARCHAR(50) DEFAULT NULL,
    browser VARCHAR(100) DEFAULT NULL,
    location VARCHAR(255) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_reported BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_created_at (created_at)
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    link_clicks INT DEFAULT 0,
    messages_received INT DEFAULT 0,
    story_shares INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date)
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    reporter_id INT DEFAULT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    INDEX idx_message_id (message_id),
    INDEX idx_status (status)
);

-- Rate Limiting Table
CREATE TABLE IF NOT EXISTS rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    target_user_id INT NOT NULL,
    message_count INT DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ip_user (ip_address, target_user_id)
);
