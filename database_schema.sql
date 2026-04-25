-- This is the raw PostgreSQL script for the collected data layout as requested.
-- However, please note that because you are using Django, your application will 
-- generate equivalent tables automatically using the models defined in UserAuth/models/models.py
-- once you connect PostgreSQL to the Django project.

CREATE TABLE IF NOT EXISTS users_signup_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    nic_national_id VARCHAR(15) UNIQUE NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    nearest_hospital VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL, -- Never store plain text passwords, store hashed!
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster routing/checking during login
CREATE INDEX idx_users_email ON users_signup_data(email_address);
CREATE INDEX idx_users_username ON users_signup_data(username);
