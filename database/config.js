// Database Configuration for NSS Volunteers System
// This file contains database connection settings and queries

const mysql = require('mysql2/promise');

// Database configuration optimized for 100+ concurrent users
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nss_volunteers_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 50, // Increased for concurrent users
  queueLimit: 100, // Allow queuing of connection requests
  acquireTimeout: 30000, // Reduced timeout for faster failure detection
  timeout: 30000,
  reconnect: true,
  // Additional performance optimizations
  multipleStatements: false,
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
  // Connection pool optimizations
  idleTimeout: 300000, // 5 minutes
  maxReconnects: 3,
  reconnectDelay: 2000,
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool with error handling
const pool = mysql.createPool(dbConfig);

// Add connection pool event listeners for monitoring
pool.on('connection', (connection) => {
  console.log(`New database connection established as id ${connection.threadId}`);
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Database connection lost, attempting to reconnect...');
  }
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

// Database queries
const queries = {
  // User queries
  users: {
    create: `INSERT INTO users (id, full_name, roll_number, branch, password, profile_photo, join_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
    getById: `SELECT * FROM users WHERE id = ?`,
    getByRollNumber: `SELECT * FROM users WHERE roll_number = ?`,
    getAll: `SELECT * FROM users ORDER BY created_at DESC`,
    getApproved: `SELECT * FROM users WHERE is_approved = TRUE ORDER BY created_at DESC`,
    getPending: `SELECT * FROM users WHERE is_approved = FALSE AND is_rejected = FALSE ORDER BY created_at DESC`,
    approve: `UPDATE users SET is_approved = TRUE, is_rejected = FALSE, approved_by = ?, approved_at = NOW() WHERE id = ?`,
    reject: `UPDATE users SET is_approved = FALSE, is_rejected = TRUE, rejected_by = ?, rejected_at = NOW(), rejection_reason = ? WHERE id = ?`,
    update: `UPDATE users SET full_name = ?, branch = ?, profile_photo = ?, updated_at = NOW() WHERE id = ?`,
    delete: `DELETE FROM users WHERE id = ?`
  },

  // Achievement queries
  achievements: {
    create: `INSERT INTO achievements (id, user_id, title, description, level, achievement_date, photo_url, is_verified, verified_by, verified_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?, NOW())`,
    getByUserId: `SELECT * FROM achievements WHERE user_id = ? ORDER BY achievement_date DESC`,
    getAll: `SELECT a.*, u.full_name, u.roll_number FROM achievements a 
             JOIN users u ON a.user_id = u.id 
             WHERE u.is_approved = TRUE 
             ORDER BY a.level DESC, a.achievement_date DESC`,
    getTopAchievements: `SELECT a.*, u.full_name, u.roll_number FROM achievements a 
                         JOIN users u ON a.user_id = u.id 
                         WHERE u.is_approved = TRUE 
                         ORDER BY 
                           CASE a.level 
                             WHEN 'national' THEN 3 
                             WHEN 'state' THEN 2 
                             WHEN 'district' THEN 1 
                           END DESC, 
                           a.achievement_date DESC 
                         LIMIT ?`,
    update: `UPDATE achievements SET title = ?, description = ?, level = ?, achievement_date = ?, photo_url = ?, updated_at = NOW() WHERE id = ?`,
    delete: `DELETE FROM achievements WHERE id = ?`
  },

  // Certificate queries
  certificates: {
    create: `INSERT INTO certificates (id, user_id, title, description, file_url, upload_date, is_verified, verified_by, verified_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    getByUserId: `SELECT * FROM certificates WHERE user_id = ? ORDER BY upload_date DESC`,
    getAll: `SELECT c.*, u.full_name, u.roll_number FROM certificates c 
             JOIN users u ON c.user_id = u.id 
             ORDER BY c.upload_date DESC`,
    verify: `UPDATE certificates SET is_verified = TRUE, verified_by = ?, verified_at = NOW() WHERE id = ?`,
    update: `UPDATE certificates SET title = ?, description = ?, updated_at = NOW() WHERE id = ?`,
    delete: `DELETE FROM certificates WHERE id = ?`
  },

  // Event queries
  events: {
    create: `INSERT INTO events (id, title, description, event_date, start_date, end_date, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
    getAll: `SELECT * FROM events ORDER BY event_date DESC`,
    getById: `SELECT * FROM events WHERE id = ?`,
    getUpcoming: `SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC`,
    update: `UPDATE events SET title = ?, description = ?, event_date = ?, start_date = ?, end_date = ?, updated_at = NOW() WHERE id = ?`,
    delete: `DELETE FROM events WHERE id = ?`
  },

  // Event registration queries
  eventRegistrations: {
    create: `INSERT INTO event_registrations (id, event_id, user_id, user_roll_number, user_name) 
             VALUES (?, ?, ?, ?, ?)`,
    getByEventId: `SELECT * FROM event_registrations WHERE event_id = ? ORDER BY registered_at DESC`,
    getByUserId: `SELECT er.*, e.title as event_title, e.start_date, e.end_date 
                  FROM event_registrations er 
                  JOIN events e ON er.event_id = e.id 
                  WHERE er.user_id = ? 
                  ORDER BY er.registered_at DESC`,
    approve: `UPDATE event_registrations SET is_approved = TRUE, approved_by = ?, approved_at = NOW() WHERE id = ?`,
    checkRegistration: `SELECT * FROM event_registrations WHERE event_id = ? AND user_id = ?`,
    updateAttendance: `UPDATE event_registrations SET attendance_status = ?, attendance_date = NOW() WHERE id = ?`
  },

  // Event photos queries
  eventPhotos: {
    create: `INSERT INTO event_photos (id, user_id, event_id, photo_url, title, description) 
             VALUES (?, ?, ?, ?, ?, ?)`,
    getByUserId: `SELECT * FROM event_photos WHERE user_id = ? ORDER BY upload_date DESC`,
    getByEventId: `SELECT * FROM event_photos WHERE event_id = ? ORDER BY upload_date DESC`,
    update: `UPDATE event_photos SET title = ?, description = ? WHERE id = ?`,
    delete: `DELETE FROM event_photos WHERE id = ?`
  },

  // Suggestion queries
  suggestions: {
    create: `INSERT INTO suggestions (id, user_id, user_name, user_roll_number, title, description, category) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
    getAll: `SELECT * FROM suggestions ORDER BY created_at DESC`,
    getByStatus: `SELECT * FROM suggestions WHERE status = ? ORDER BY created_at DESC`,
    getByUserId: `SELECT * FROM suggestions WHERE user_id = ? ORDER BY created_at DESC`,
    updateStatus: `UPDATE suggestions SET status = ?, reviewed_by = ?, reviewed_at = NOW(), response = ? WHERE id = ?`,
    delete: `DELETE FROM suggestions WHERE id = ?`
  },

  // Admin queries
  admins: {
    getByUsername: `SELECT * FROM admin_users WHERE username = ? AND is_active = TRUE`,
    getByEmail: `SELECT * FROM admin_users WHERE email = ? AND is_active = TRUE`,
    create: `INSERT INTO admin_users (id, username, email, password, full_name, role) 
             VALUES (?, ?, ?, ?, ?, ?)`,
    updateLastLogin: `UPDATE admin_users SET last_login = NOW() WHERE id = ?`
  },

  // Statistics queries
  statistics: {
    userStats: `SELECT 
                  COUNT(*) as total_users,
                  COUNT(CASE WHEN is_approved = TRUE THEN 1 END) as approved_users,
                  COUNT(CASE WHEN is_approved = FALSE AND is_rejected = FALSE THEN 1 END) as pending_users,
                  COUNT(CASE WHEN is_rejected = TRUE THEN 1 END) as rejected_users
                FROM users`,
    achievementStats: `SELECT 
                         level,
                         COUNT(*) as count,
                         COUNT(CASE WHEN is_verified = TRUE THEN 1 END) as verified_count
                       FROM achievements 
                       GROUP BY level`,
    eventStats: `SELECT 
                   COUNT(*) as total_events,
                   COUNT(CASE WHEN event_date >= CURDATE() THEN 1 END) as upcoming_events,
                   COUNT(CASE WHEN event_date < CURDATE() THEN 1 END) as past_events
                 FROM events`,
    suggestionStats: `SELECT 
                        status,
                        COUNT(*) as count
                      FROM suggestions 
                      GROUP BY status`
  }
};

// Utility functions
const dbUtils = {
  // Generate UUID
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // Hash password (you should use bcrypt in production)
  hashPassword: async (password) => {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  // Compare password
  comparePassword: async (password, hash) => {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, hash);
  },

  // Format date for database
  formatDate: (date) => {
    return new Date(date).toISOString().split('T')[0];
  },

  // Get current timestamp
  getCurrentTimestamp: () => {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
};

// Export configuration
module.exports = {
  pool,
  queries,
  dbUtils,
  dbConfig
};
