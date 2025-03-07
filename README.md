# appointly-backend

# Database and Application Setup Instructions

### 1. **Create Database and Tables**

```sql
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS appointment_system;
USE appointment_system;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Insert initial admin users if they don't exist
INSERT IGNORE INTO users (username, password, role) VALUES
('admin1', '$2b$10$E2Z7z7z7z7z7z7z7z7z7u', 'admin'),
('admin2', '$2b$10$E2Z7z7z7z7z7z7z7z7z7u', 'admin');

-- Insert initial regular users if they don't exist
INSERT IGNORE INTO users (username, password, role) VALUES
('jonny', '$2b$10$E2Z7z7z7z7z7z7z7z7z7u', 'user'),
('sammy', '$2b$10$E2Z7z7z7z7z7z7z7z7z7u', 'user');

Run the following commands to create the database (if it doesn't already exist) and use it:

```sql
CREATE DATABASE IF NOT EXISTS your_database_name;
USE your_database_name;
```

### 2. **Run the Script**
You can run the script in the following ways:

Option 1: Using Command Line
```bash
mysql -u username -p your_database_name < schema.sql
```
Option 2: Using MySQL Workbench or phpMyAdmin
Open your MySQL management tool (e.g., MySQL Workbench or phpMyAdmin).
Paste the SQL script in the query window and execute it.

### 3: Start the Application
Run the backend application with the following command:

```bash
npm start
```
