-- NSS Volunteers Tracking System Database Schema
-- Created for CMRIT NSS Unit
-- This schema supports all features: volunteer tracking, achievements, certificates, events, and feedback

-- =============================================
-- DATABASE CREATION
-- =============================================

CREATE DATABASE IF NOT EXISTS nss_volunteers_db;
USE nss_volunteers_db;

-- =============================================
-- USERS TABLE (NSS Volunteers)
-- =============================================

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_photo TEXT,
    qr_code TEXT,
    join_date DATE NOT NULL,
    end_date DATE NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_rejected BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(255) NULL,
    approved_at TIMESTAMP NULL,
    rejected_by VARCHAR(255) NULL,
    rejected_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_roll_number (roll_number),
    INDEX idx_approved (is_approved),
    INDEX idx_join_date (join_date)
);

-- =============================================
-- ACHIEVEMENTS TABLE
-- =============================================

CREATE TABLE achievements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    level ENUM('national', 'state', 'district') NOT NULL,
    achievement_date DATE NOT NULL,
    photo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255) NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_level (level),
    INDEX idx_achievement_date (achievement_date),
    INDEX idx_verified (is_verified)
);

-- =============================================
-- CERTIFICATES TABLE
-- =============================================

CREATE TABLE certificates (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NULL,
    file_size INT NULL,
    upload_date DATE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255) NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_upload_date (upload_date),
    INDEX idx_verified (is_verified)
);

-- =============================================
-- EVENTS TABLE (Admin Created Events)
-- =============================================

CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(255) NULL,
    max_participants INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_event_date (event_date),
    INDEX idx_start_date (start_date),
    INDEX idx_end_date (end_date),
    INDEX idx_active (is_active)
);

-- =============================================
-- EVENT REGISTRATIONS TABLE
-- =============================================

CREATE TABLE event_registrations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    user_roll_number VARCHAR(50) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(255) NULL,
    approved_at TIMESTAMP NULL,
    attendance_status ENUM('registered', 'attended', 'completed') DEFAULT 'registered',
    attendance_date TIMESTAMP NULL,
    completion_date TIMESTAMP NULL,
    notes TEXT NULL,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_user (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_approved (is_approved),
    INDEX idx_attendance_status (attendance_status)
);

-- =============================================
-- EVENT PHOTOS TABLE
-- =============================================

CREATE TABLE event_photos (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NULL,
    photo_url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_upload_date (upload_date)
);

-- =============================================
-- SUGGESTIONS TABLE (Feedback System)
-- =============================================

CREATE TABLE suggestions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    user_name VARCHAR(255) NOT NULL,
    user_roll_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('general', 'event', 'system', 'achievement') DEFAULT 'general',
    status ENUM('pending', 'reviewed', 'implemented', 'rejected') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    reviewed_by VARCHAR(255) NULL,
    reviewed_at TIMESTAMP NULL,
    response TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- ADMIN USERS TABLE
-- =============================================

CREATE TABLE admin_users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- =============================================
-- SYSTEM SETTINGS TABLE
-- =============================================

CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT NULL,
    updated_by VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- AUDIT LOG TABLE
-- =============================================

CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    admin_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(36) NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_admin_id (admin_id),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Insert default admin user
INSERT INTO admin_users (id, username, email, password, full_name, role) VALUES
('admin-001', 'admin', 'admin@cmrit.ac.in', '$2b$10$example_hashed_password', 'NSS Admin', 'super_admin');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'CMRIT NSS Portfolio System', 'Name of the NSS system'),
('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('allowed_file_types', 'jpg,jpeg,png,pdf,doc,docx', 'Allowed file types for uploads'),
('achievement_auto_approve', 'false', 'Auto-approve achievements when added by admin'),
('feedback_email_notifications', 'true', 'Send email notifications for new feedback'),
('maintenance_mode', 'false', 'Enable maintenance mode');

-- =============================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =============================================

-- View for user statistics
CREATE VIEW user_statistics AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_approved = TRUE THEN 1 END) as approved_users,
    COUNT(CASE WHEN is_approved = FALSE AND is_rejected = FALSE THEN 1 END) as pending_users,
    COUNT(CASE WHEN is_rejected = TRUE THEN 1 END) as rejected_users,
    COUNT(CASE WHEN join_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as new_users_last_30_days
FROM users;

-- View for achievement statistics
CREATE VIEW achievement_statistics AS
SELECT 
    level,
    COUNT(*) as count,
    COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_count
FROM achievements
GROUP BY level;

-- View for event statistics
CREATE VIEW event_statistics AS
SELECT 
    e.id,
    e.title,
    e.event_date,
    COUNT(er.id) as total_registrations,
    COUNT(CASE WHEN er.is_approved = TRUE THEN 1 END) as approved_registrations,
    COUNT(CASE WHEN er.attendance_status = 'completed' THEN 1 END) as completed_attendance
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
GROUP BY e.id, e.title, e.event_date;

-- View for user achievements with details
CREATE VIEW user_achievements_view AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.roll_number,
    a.id as achievement_id,
    a.title,
    a.description,
    a.level,
    a.achievement_date,
    a.photo_url,
    a.is_verified
FROM users u
JOIN achievements a ON u.id = a.user_id
WHERE u.is_approved = TRUE
ORDER BY a.level DESC, a.achievement_date DESC;

-- =============================================
-- CREATE STORED PROCEDURES
-- =============================================

DELIMITER //

-- Procedure to approve a user
CREATE PROCEDURE ApproveUser(
    IN p_user_id VARCHAR(36),
    IN p_admin_id VARCHAR(36)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    UPDATE users 
    SET is_approved = TRUE, 
        is_rejected = FALSE,
        approved_by = (SELECT username FROM admin_users WHERE id = p_admin_id),
        approved_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
    
    INSERT INTO audit_logs (id, admin_id, action, table_name, record_id, new_values)
    VALUES (UUID(), p_admin_id, 'APPROVE_USER', 'users', p_user_id, 
            JSON_OBJECT('is_approved', TRUE, 'approved_at', CURRENT_TIMESTAMP));
    
    COMMIT;
END //

-- Procedure to add achievement
CREATE PROCEDURE AddAchievement(
    IN p_user_id VARCHAR(36),
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_level ENUM('national', 'state', 'district'),
    IN p_achievement_date DATE,
    IN p_photo_url TEXT,
    IN p_admin_id VARCHAR(36)
)
BEGIN
    DECLARE v_achievement_id VARCHAR(36);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    SET v_achievement_id = UUID();
    
    INSERT INTO achievements (id, user_id, title, description, level, achievement_date, photo_url, is_verified, verified_by, verified_at)
    VALUES (v_achievement_id, p_user_id, p_title, p_description, p_level, p_achievement_date, p_photo_url, TRUE, 
            (SELECT username FROM admin_users WHERE id = p_admin_id), CURRENT_TIMESTAMP);
    
    INSERT INTO audit_logs (id, admin_id, action, table_name, record_id, new_values)
    VALUES (UUID(), p_admin_id, 'ADD_ACHIEVEMENT', 'achievements', v_achievement_id, 
            JSON_OBJECT('user_id', p_user_id, 'title', p_title, 'level', p_level));
    
    COMMIT;
END //

-- Procedure to get user dashboard data
CREATE PROCEDURE GetUserDashboard(IN p_user_id VARCHAR(36))
BEGIN
    SELECT 
        u.id,
        u.full_name,
        u.roll_number,
        u.branch,
        u.profile_photo,
        u.join_date,
        u.is_approved,
        COUNT(DISTINCT a.id) as achievement_count,
        COUNT(DISTINCT c.id) as certificate_count,
        COUNT(DISTINCT er.id) as event_participation_count,
        COUNT(DISTINCT ep.id) as event_photos_count
    FROM users u
    LEFT JOIN achievements a ON u.id = a.user_id
    LEFT JOIN certificates c ON u.id = c.user_id
    LEFT JOIN event_registrations er ON u.id = er.user_id
    LEFT JOIN event_photos ep ON u.id = ep.user_id
    WHERE u.id = p_user_id
    GROUP BY u.id;
END //

DELIMITER ;

-- =============================================
-- CREATE TRIGGERS
-- =============================================

-- Trigger to update user statistics when user is approved
DELIMITER //
CREATE TRIGGER after_user_approval
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.is_approved = TRUE AND OLD.is_approved = FALSE THEN
        INSERT INTO notifications (id, user_id, title, message, type)
        VALUES (UUID(), NEW.id, 'Account Approved', 'Your NSS account has been approved! You can now access all features.', 'success');
    END IF;
END //

-- Trigger to log achievement additions
CREATE TRIGGER after_achievement_insert
AFTER INSERT ON achievements
FOR EACH ROW
BEGIN
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES (UUID(), NEW.user_id, 'New Achievement Added', CONCAT('A new ', NEW.level, ' level achievement has been added to your profile.'), 'info');
END //

DELIMITER ;

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Composite indexes for common queries
CREATE INDEX idx_users_approval_status ON users(is_approved, is_rejected, created_at);
CREATE INDEX idx_achievements_user_level ON achievements(user_id, level, achievement_date);
CREATE INDEX idx_event_registrations_status ON event_registrations(event_id, is_approved, attendance_status);
CREATE INDEX idx_suggestions_status_category ON suggestions(status, category, created_at);

-- =============================================
-- GRANT PERMISSIONS (Adjust as needed)
-- =============================================

-- Create application user (replace with your application credentials)
-- CREATE USER 'nss_app_user'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON nss_volunteers_db.* TO 'nss_app_user'@'localhost';
-- FLUSH PRIVILEGES;

-- =============================================
-- SAMPLE DATA FOR TESTING (Optional)
-- =============================================

-- Insert sample users
INSERT INTO users (id, full_name, roll_number, branch, password, join_date, is_approved) VALUES
('user-001', 'John Doe', '21CS001', 'Computer Science', '$2b$10$example_hash', '2024-01-15', TRUE),
('user-002', 'Jane Smith', '21EC002', 'Electronics', '$2b$10$example_hash', '2024-01-20', TRUE),
('user-003', 'Mike Johnson', '21ME003', 'Mechanical', '$2b$10$example_hash', '2024-02-01', FALSE);

-- Insert sample achievements
INSERT INTO achievements (id, user_id, title, description, level, achievement_date, photo_url, is_verified) VALUES
('ach-001', 'user-001', 'National Level Coding Competition Winner', 'Won first place in national coding competition', 'national', '2024-03-15', 'https://example.com/photo1.jpg', TRUE),
('ach-002', 'user-002', 'State Level Robotics Championship', 'Participated and won in state level robotics championship', 'state', '2024-03-20', 'https://example.com/photo2.jpg', TRUE);

-- Insert sample events
INSERT INTO events (id, title, description, event_date, start_date, end_date, created_by) VALUES
('event-001', 'Community Service Drive', 'Annual community service drive in local area', '2024-04-15', '2024-04-15', '2024-04-15', 'admin'),
('event-002', 'Blood Donation Camp', 'Blood donation camp organized by NSS unit', '2024-04-20', '2024-04-20', '2024-04-20', 'admin');

-- =============================================
-- END OF SCHEMA
-- =============================================

-- This schema provides a complete foundation for the NSS Volunteers tracking system
-- with all necessary tables, relationships, indexes, views, procedures, and triggers
-- to support the features implemented in the React application.
