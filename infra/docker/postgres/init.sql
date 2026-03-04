# PostgreSQL initialization script
# This file is automatically run when postgres container starts
# Create initial databases, users, or roles here

-- Create extensions
CREATE EXTENSION IF NOT EXISTS uuid-ossp;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users and permissions can be set via environment variables
-- The main user and database are already created via POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
