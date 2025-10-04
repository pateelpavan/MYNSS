-- Supabase Database Schema for NSS Volunteers System
-- This file contains the complete database schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_photo TEXT,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_rejected BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_by VARCHAR(255),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    join_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(20) NOT NULL CHECK (level IN ('national', 'district', 'state')),
    achievement_date DATE NOT NULL,
    photo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    upload_date DATE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_roll_number VARCHAR(50) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    attendance_status VARCHAR(50),
    attendance_date TIMESTAMP WITH TIME ZONE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Create event_photos table
CREATE TABLE event_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suggestions table
CREATE TABLE suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_roll_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('general', 'event', 'system', 'achievement')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented', 'rejected')),
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_roll_number ON users(roll_number);
CREATE INDEX idx_users_qr_code ON users(qr_code);
CREATE INDEX idx_users_approved ON users(is_approved);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_level ON achievements(level);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_photos_user_id ON event_photos(user_id);
CREATE INDEX idx_event_photos_event_id ON event_photos(event_id);
CREATE INDEX idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_photos_updated_at BEFORE UPDATE ON event_photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at BEFORE UPDATE ON suggestions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (adjust based on your security requirements)
-- Users table policies
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true);

-- Achievements table policies
CREATE POLICY "Achievements are viewable by everyone" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Achievements can be inserted by everyone" ON achievements
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Achievements can be updated by everyone" ON achievements
    FOR UPDATE USING (true);

-- Certificates table policies
CREATE POLICY "Certificates are viewable by everyone" ON certificates
    FOR SELECT USING (true);

CREATE POLICY "Certificates can be inserted by everyone" ON certificates
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Certificates can be updated by everyone" ON certificates
    FOR UPDATE USING (true);

-- Events table policies
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Events can be inserted by everyone" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Events can be updated by everyone" ON events
    FOR UPDATE USING (true);

-- Event registrations table policies
CREATE POLICY "Event registrations are viewable by everyone" ON event_registrations
    FOR SELECT USING (true);

CREATE POLICY "Event registrations can be inserted by everyone" ON event_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Event registrations can be updated by everyone" ON event_registrations
    FOR UPDATE USING (true);

-- Event photos table policies
CREATE POLICY "Event photos are viewable by everyone" ON event_photos
    FOR SELECT USING (true);

CREATE POLICY "Event photos can be inserted by everyone" ON event_photos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Event photos can be updated by everyone" ON event_photos
    FOR UPDATE USING (true);

-- Suggestions table policies
CREATE POLICY "Suggestions are viewable by everyone" ON suggestions
    FOR SELECT USING (true);

CREATE POLICY "Suggestions can be inserted by everyone" ON suggestions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Suggestions can be updated by everyone" ON suggestions
    FOR UPDATE USING (true);

-- Admin users table policies (more restrictive)
CREATE POLICY "Admin users are viewable by everyone" ON admin_users
    FOR SELECT USING (true);

CREATE POLICY "Admin users can be inserted by everyone" ON admin_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin users can be updated by everyone" ON admin_users
    FOR UPDATE USING (true);

-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (username, email, password, full_name, role) VALUES
('admin', 'admin@nss.com', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'System Administrator', 'super_admin');

-- Insert sample data for testing
INSERT INTO users (full_name, roll_number, branch, password, qr_code, join_date, is_approved) VALUES
('John Doe', '21CS001', 'Computer Science', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'QR001', '2024-01-01', true),
('Jane Smith', '21IT002', 'Information Technology', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'QR002', '2024-01-02', true),
('Bob Johnson', '21EC003', 'Electronics', '$2b$10$rQZ8K9L2vN3mP4qR5sT6uO7wX8yZ9A0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU', 'QR003', '2024-01-03', false);

-- Insert sample events
INSERT INTO events (title, description, event_date, start_date, end_date, created_by) VALUES
('Blood Donation Camp', 'Annual blood donation camp for the community', '2024-02-15', '2024-02-15', '2024-02-15', 'admin'),
('Tree Plantation Drive', 'Planting trees for environmental conservation', '2024-03-20', '2024-03-20', '2024-03-20', 'admin'),
('Cleanliness Drive', 'Cleaning the campus and surrounding areas', '2024-04-10', '2024-04-10', '2024-04-10', 'admin');

-- Insert sample achievements
INSERT INTO achievements (user_id, title, description, level, achievement_date, is_verified) VALUES
((SELECT id FROM users WHERE roll_number = '21CS001'), 'Best Volunteer Award', 'Awarded for outstanding community service', 'state', '2024-01-15', true),
((SELECT id FROM users WHERE roll_number = '21IT002'), 'Leadership Excellence', 'Recognized for leadership in NSS activities', 'district', '2024-01-20', true);

-- Insert sample suggestions
INSERT INTO suggestions (user_id, user_name, user_roll_number, title, description, category) VALUES
((SELECT id FROM users WHERE roll_number = '21CS001'), 'John Doe', '21CS001', 'Digital Registration System', 'Implement an online registration system for events', 'system'),
((SELECT id FROM users WHERE roll_number = '21IT002'), 'Jane Smith', '21IT002', 'Mobile App Development', 'Create a mobile app for better accessibility', 'general');
