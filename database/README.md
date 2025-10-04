# NSS Volunteers Database Schema

This directory contains the complete database schema and setup files for the NSS Volunteers tracking system.

## 📁 Files Overview

### Core Schema Files
- **`nss_volunteers_schema.sql`** - Complete database schema with all tables, relationships, views, procedures, and triggers
- **`setup.sql`** - Simplified setup script for quick database initialization
- **`sample_data.sql`** - Sample data for testing and development
- **`config.js`** - Database configuration and query definitions for Node.js applications

## 🚀 Quick Setup

### 1. Database Setup
```bash
# Connect to MySQL
mysql -u root -p

# Run the setup script
source database/setup.sql

# Or run the complete schema
source database/nss_volunteers_schema.sql
```

### 2. Sample Data (Optional)
```bash
# Add sample data for testing
source database/sample_data.sql
```

## 📊 Database Structure

### Core Tables

#### 👥 **users**
- Stores NSS volunteer information
- Fields: id, full_name, roll_number, branch, password, profile_photo, join_date, end_date, approval status
- Indexes: roll_number, approval status, join_date

#### 🏆 **achievements**
- Stores volunteer achievements (national, state, district level)
- Fields: id, user_id, title, description, level, achievement_date, photo_url, verification status
- Foreign Key: user_id → users(id)

#### 📜 **certificates**
- Stores uploaded certificates and documents
- Fields: id, user_id, title, description, file_url, upload_date, verification status
- Foreign Key: user_id → users(id)

#### 📅 **events**
- Stores NSS events created by admins
- Fields: id, title, description, event_date, start_date, end_date, created_by
- Indexes: event_date, start_date, end_date

#### 📝 **event_registrations**
- Stores volunteer registrations for events
- Fields: id, event_id, user_id, registration details, approval status, attendance status
- Foreign Keys: event_id → events(id), user_id → users(id)

#### 📸 **event_photos**
- Stores photos uploaded by volunteers
- Fields: id, user_id, event_id, photo_url, title, description
- Foreign Keys: user_id → users(id), event_id → events(id)

#### 💬 **suggestions**
- Stores feedback and suggestions from users
- Fields: id, user_id, title, description, category, status, admin response
- Foreign Key: user_id → users(id)

#### 👨‍💼 **admin_users**
- Stores admin user accounts
- Fields: id, username, email, password, full_name, role, status

### Additional Tables

#### ⚙️ **system_settings**
- Stores system configuration settings
- Fields: setting_key, setting_value, description

#### 🔔 **notifications**
- Stores user notifications
- Fields: id, user_id, title, message, type, read status

#### 📋 **audit_logs**
- Stores system audit trail
- Fields: id, user_id, admin_id, action, table_name, record_id, old_values, new_values

## 🔍 Views

### **user_statistics**
- Provides user count statistics (total, approved, pending, rejected)

### **achievement_statistics**
- Provides achievement statistics by level

### **event_statistics**
- Provides event statistics with registration counts

### **user_achievements_view**
- Provides user achievements with user details

## 🛠️ Stored Procedures

### **ApproveUser(user_id, admin_id)**
- Approves a user and logs the action

### **AddAchievement(user_id, title, description, level, date, photo_url, admin_id)**
- Adds a new achievement and logs the action

### **GetUserDashboard(user_id)**
- Returns comprehensive user dashboard data

## 🔧 Triggers

### **after_user_approval**
- Sends notification when user is approved

### **after_achievement_insert**
- Sends notification when achievement is added

## 📈 Indexes

The database includes optimized indexes for:
- User lookups by roll number
- Achievement queries by user and level
- Event queries by date
- Registration status queries
- Suggestion status queries

## 🔐 Security Features

- **Password hashing**: Use bcrypt for password storage
- **SQL injection protection**: Use parameterized queries
- **Audit logging**: All admin actions are logged
- **Role-based access**: Different admin roles (super_admin, admin, moderator)

## 🌐 Environment Variables

Create a `.env` file with:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=nss_volunteers_db
DB_PORT=3306
```

## 📱 Integration with React App

The `config.js` file provides:
- Database connection pool
- Predefined queries for all operations
- Utility functions for common tasks
- UUID generation
- Password hashing/verification

## 🧪 Testing

Use the sample data to test:
- User registration and approval
- Achievement management
- Event creation and registration
- Certificate uploads
- Feedback system
- Admin operations

## 📊 Sample Data Includes

- **6 sample users** (5 approved, 1 pending)
- **6 achievements** (2 national, 2 state, 2 district)
- **5 certificates** (4 verified, 1 pending)
- **6 events** (past and upcoming)
- **10 event registrations** (various statuses)
- **6 event photos**
- **6 suggestions** (various categories and statuses)
- **3 admin users** (different roles)
- **System settings**
- **5 notifications**

## 🔄 Maintenance

### Regular Tasks
- Backup database regularly
- Monitor performance with slow query log
- Update indexes based on usage patterns
- Clean up old audit logs periodically

### Performance Optimization
- Use connection pooling
- Implement query caching
- Monitor and optimize slow queries
- Consider read replicas for heavy read operations

## 🚨 Important Notes

1. **Change default passwords** before production use
2. **Use SSL connections** in production
3. **Implement proper backup strategy**
4. **Monitor database performance**
5. **Keep database software updated**

## 📞 Support

For database-related issues:
- Check MySQL error logs
- Verify connection settings
- Ensure proper permissions
- Review query performance

---

**Database Version**: MySQL 8.0+  
**Character Set**: utf8mb4  
**Collation**: utf8mb4_unicode_ci  
**Engine**: InnoDB
