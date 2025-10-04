-- Sample Data for NSS Volunteers Database
-- This file contains sample data for testing the system

USE nss_volunteers_db;

-- Insert sample users
INSERT INTO users (id, full_name, roll_number, branch, password, profile_photo, join_date, is_approved) VALUES
('user-001', 'John Doe', '21CS001', 'Computer Science', '$2b$10$example_hash_1', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '2024-01-15', TRUE),
('user-002', 'Jane Smith', '21EC002', 'Electronics', '$2b$10$example_hash_2', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '2024-01-20', TRUE),
('user-003', 'Mike Johnson', '21ME003', 'Mechanical', '$2b$10$example_hash_3', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '2024-02-01', TRUE),
('user-004', 'Sarah Wilson', '21CE004', 'Civil', '$2b$10$example_hash_4', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '2024-02-10', TRUE),
('user-005', 'David Brown', '21IT005', 'Information Technology', '$2b$10$example_hash_5', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '2024-02-15', FALSE),
('user-006', 'Emily Davis', '21CS006', 'Computer Science', '$2b$10$example_hash_6', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '2024-03-01', TRUE);

-- Insert sample achievements
INSERT INTO achievements (id, user_id, title, description, level, achievement_date, photo_url, is_verified, verified_by, verified_at) VALUES
('ach-001', 'user-001', 'National Level Coding Competition Winner', 'Won first place in the National Coding Championship 2024 organized by TechGiant Inc. Competed against 500+ participants from across the country.', 'national', '2024-03-15', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', TRUE, 'admin', '2024-03-15 10:30:00'),
('ach-002', 'user-002', 'State Level Robotics Championship', 'Participated and won second place in the Telangana State Robotics Championship. Built an autonomous robot for disaster relief operations.', 'state', '2024-03-20', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop', TRUE, 'admin', '2024-03-20 14:15:00'),
('ach-003', 'user-003', 'District Level Engineering Project Competition', 'Won first place in the Hyderabad District Engineering Project Competition for designing an eco-friendly water purification system.', 'district', '2024-03-25', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop', TRUE, 'admin', '2024-03-25 16:45:00'),
('ach-004', 'user-004', 'National Level Environmental Awareness Campaign', 'Led a team of 50 volunteers in a national-level environmental awareness campaign that reached over 10,000 people across 5 states.', 'national', '2024-04-01', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop', TRUE, 'admin', '2024-04-01 09:20:00'),
('ach-005', 'user-001', 'State Level Hackathon Winner', 'Won first place in the Telangana State Hackathon for developing a mobile app for rural healthcare management.', 'state', '2024-04-10', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', TRUE, 'admin', '2024-04-10 18:30:00'),
('ach-006', 'user-006', 'District Level Community Service Award', 'Received the Best Community Service Award from the Hyderabad District Collector for organizing blood donation camps.', 'district', '2024-04-15', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', TRUE, 'admin', '2024-04-15 12:00:00');

-- Insert sample certificates
INSERT INTO certificates (id, user_id, title, description, file_url, upload_date, is_verified, verified_by, verified_at) VALUES
('cert-001', 'user-001', 'Python Programming Certificate', 'Completed advanced Python programming course with 95% score', 'https://example.com/certificates/python_cert_001.pdf', '2024-01-20', TRUE, 'admin', '2024-01-20 10:00:00'),
('cert-002', 'user-002', 'Robotics Workshop Certificate', 'Completed 40-hour robotics workshop organized by IIT Hyderabad', 'https://example.com/certificates/robotics_cert_002.pdf', '2024-02-05', TRUE, 'admin', '2024-02-05 14:30:00'),
('cert-003', 'user-003', 'CAD Design Certificate', 'Certified in AutoCAD and SolidWorks for mechanical design', 'https://example.com/certificates/cad_cert_003.pdf', '2024-02-15', TRUE, 'admin', '2024-02-15 16:45:00'),
('cert-004', 'user-004', 'Environmental Engineering Certificate', 'Completed environmental impact assessment course', 'https://example.com/certificates/env_cert_004.pdf', '2024-03-01', FALSE, NULL, NULL),
('cert-005', 'user-001', 'Machine Learning Certificate', 'Completed machine learning specialization course from Coursera', 'https://example.com/certificates/ml_cert_005.pdf', '2024-03-10', TRUE, 'admin', '2024-03-10 11:20:00');

-- Insert sample events
INSERT INTO events (id, title, description, event_date, start_date, end_date, created_by) VALUES
('event-001', 'Community Service Drive', 'Annual community service drive in local slum areas. Volunteers will help in cleaning, teaching children, and providing basic healthcare services.', '2024-04-15', '2024-04-15', '2024-04-15', 'admin'),
('event-002', 'Blood Donation Camp', 'Blood donation camp organized by NSS unit in collaboration with Red Cross Society. Target: 100 units of blood.', '2024-04-20', '2024-04-20', '2024-04-20', 'admin'),
('event-003', 'Tree Plantation Drive', 'Mass tree plantation drive in the college campus and surrounding areas. Target: 500 saplings.', '2024-04-25', '2024-04-25', '2024-04-25', 'admin'),
('event-004', 'Digital Literacy Program', 'Teaching basic computer skills to underprivileged children in nearby villages. 4-week program.', '2024-05-01', '2024-05-01', '2024-05-28', 'admin'),
('event-005', 'Health Awareness Camp', 'Health checkup and awareness camp for senior citizens in the community.', '2024-05-10', '2024-05-10', '2024-05-10', 'admin'),
('event-006', 'Clean India Campaign', 'Participation in Swachh Bharat Abhiyan - cleaning public places and spreading awareness about cleanliness.', '2024-05-15', '2024-05-15', '2024-05-15', 'admin');

-- Insert sample event registrations
INSERT INTO event_registrations (id, event_id, user_id, user_roll_number, user_name, registered_at, is_approved, approved_by, approved_at) VALUES
('reg-001', 'event-001', 'user-001', '21CS001', 'John Doe', '2024-04-10 09:00:00', TRUE, 'admin', '2024-04-10 10:00:00'),
('reg-002', 'event-001', 'user-002', '21EC002', 'Jane Smith', '2024-04-10 09:15:00', TRUE, 'admin', '2024-04-10 10:15:00'),
('reg-003', 'event-001', 'user-003', '21ME003', 'Mike Johnson', '2024-04-10 09:30:00', TRUE, 'admin', '2024-04-10 10:30:00'),
('reg-004', 'event-002', 'user-001', '21CS001', 'John Doe', '2024-04-15 14:00:00', TRUE, 'admin', '2024-04-15 15:00:00'),
('reg-005', 'event-002', 'user-004', '21CE004', 'Sarah Wilson', '2024-04-15 14:15:00', TRUE, 'admin', '2024-04-15 15:15:00'),
('reg-006', 'event-003', 'user-002', '21EC002', 'Jane Smith', '2024-04-20 11:00:00', TRUE, 'admin', '2024-04-20 12:00:00'),
('reg-007', 'event-003', 'user-003', '21ME003', 'Mike Johnson', '2024-04-20 11:15:00', TRUE, 'admin', '2024-04-20 12:15:00'),
('reg-008', 'event-004', 'user-001', '21CS001', 'John Doe', '2024-04-25 16:00:00', FALSE, NULL, NULL),
('reg-009', 'event-004', 'user-006', '21CS006', 'Emily Davis', '2024-04-25 16:15:00', TRUE, 'admin', '2024-04-25 17:15:00'),
('reg-010', 'event-005', 'user-004', '21CE004', 'Sarah Wilson', '2024-05-05 10:00:00', TRUE, 'admin', '2024-05-05 11:00:00');

-- Insert sample event photos
INSERT INTO event_photos (id, user_id, event_id, photo_url, title, description, upload_date) VALUES
('photo-001', 'user-001', 'event-001', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', 'Community Service - Teaching Children', 'Teaching basic mathematics to children in the slum area', '2024-04-15 18:00:00'),
('photo-002', 'user-002', 'event-001', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop', 'Community Service - Health Checkup', 'Providing basic health checkup to elderly people', '2024-04-15 18:30:00'),
('photo-003', 'user-003', 'event-002', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop', 'Blood Donation Camp', 'Volunteers donating blood at the camp', '2024-04-20 16:00:00'),
('photo-004', 'user-001', 'event-002', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', 'Blood Donation - Registration', 'Volunteers helping with registration process', '2024-04-20 16:30:00'),
('photo-005', 'user-002', 'event-003', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', 'Tree Plantation Drive', 'Planting saplings in the college campus', '2024-04-25 17:00:00'),
('photo-006', 'user-003', 'event-003', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', 'Tree Plantation - Group Photo', 'Group photo after successful tree plantation', '2024-04-25 17:30:00');

-- Insert sample suggestions
INSERT INTO suggestions (id, user_id, user_name, user_roll_number, title, description, category, status, reviewed_by, reviewed_at, response) VALUES
('sugg-001', 'user-001', 'John Doe', '21CS001', 'Add more coding competitions', 'I suggest organizing more coding competitions and hackathons for computer science students. This will help improve our technical skills.', 'event', 'implemented', 'admin', '2024-04-01 10:00:00', 'Great suggestion! We have planned a monthly coding competition starting from next month.'),
('sugg-002', 'user-002', 'Jane Smith', '21EC002', 'Improve certificate verification', 'The certificate verification process takes too long. Can we make it faster or provide a status tracking system?', 'system', 'reviewed', 'admin', '2024-04-02 14:30:00', 'We are working on implementing an automated verification system. It will be ready by next month.'),
('sugg-003', 'user-003', 'Mike Johnson', '21ME003', 'More robotics workshops', 'Please organize more robotics workshops. The previous one was very helpful and many students are interested.', 'event', 'pending', NULL, NULL, NULL),
('sugg-004', 'user-004', 'Sarah Wilson', '21CE004', 'Environmental awareness programs', 'We should organize more environmental awareness programs and tree plantation drives. Climate change is a serious issue.', 'general', 'implemented', 'admin', '2024-04-05 09:15:00', 'Excellent idea! We have scheduled monthly environmental programs starting from this month.'),
('sugg-005', 'user-006', 'Emily Davis', '21CS006', 'Mobile app for NSS', 'Can we develop a mobile app for NSS activities? It would make it easier to track events and achievements.', 'system', 'reviewed', 'admin', '2024-04-08 16:45:00', 'This is a great suggestion! We are considering developing a mobile app. Will update you soon.'),
('sugg-006', NULL, 'Guest User', 'GUEST', 'Better website design', 'The website looks good but could be more user-friendly. Maybe add more animations and better navigation.', 'system', 'pending', NULL, NULL, NULL);

-- Update some event registrations to show different attendance statuses
UPDATE event_registrations SET attendance_status = 'completed' WHERE id IN ('reg-001', 'reg-002', 'reg-003');
UPDATE event_registrations SET attendance_status = 'attended' WHERE id IN ('reg-004', 'reg-005');
UPDATE event_registrations SET attendance_status = 'completed' WHERE id IN ('reg-006', 'reg-007');

-- Insert some additional admin users for testing
INSERT INTO admin_users (id, username, email, password, full_name, role) VALUES
('admin-002', 'moderator1', 'moderator1@cmrit.ac.in', '$2b$10$example_hash_moderator', 'NSS Moderator 1', 'moderator'),
('admin-003', 'admin2', 'admin2@cmrit.ac.in', '$2b$10$example_hash_admin2', 'NSS Admin 2', 'admin');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', 'CMRIT NSS Portfolio System', 'Name of the NSS system'),
('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('allowed_file_types', 'jpg,jpeg,png,pdf,doc,docx', 'Allowed file types for uploads'),
('achievement_auto_approve', 'false', 'Auto-approve achievements when added by admin'),
('feedback_email_notifications', 'true', 'Send email notifications for new feedback'),
('maintenance_mode', 'false', 'Enable maintenance mode'),
('college_name', 'CMR Institute of Technology', 'Name of the college'),
('college_address', 'Hyderabad, Telangana, India', 'College address'),
('contact_email', 'nss@cmrit.ac.in', 'Contact email for NSS unit'),
('contact_phone', '+91-40-12345678', 'Contact phone number');

-- Insert some notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
('notif-001', 'user-001', 'Welcome to NSS!', 'Your account has been approved. Welcome to the NSS family!', 'success', TRUE),
('notif-002', 'user-002', 'New Achievement Added', 'A new state level achievement has been added to your profile.', 'info', FALSE),
('notif-003', 'user-003', 'Event Registration Approved', 'Your registration for Tree Plantation Drive has been approved.', 'success', TRUE),
('notif-004', 'user-004', 'Certificate Uploaded', 'Your Environmental Engineering Certificate has been uploaded successfully.', 'info', FALSE),
('notif-005', 'user-006', 'Account Pending', 'Your account is pending approval. Please wait for admin review.', 'warning', TRUE);

-- Show summary of inserted data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'Certificates', COUNT(*) FROM certificates
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Event Registrations', COUNT(*) FROM event_registrations
UNION ALL
SELECT 'Event Photos', COUNT(*) FROM event_photos
UNION ALL
SELECT 'Suggestions', COUNT(*) FROM suggestions
UNION ALL
SELECT 'Admin Users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'System Settings', COUNT(*) FROM system_settings
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
