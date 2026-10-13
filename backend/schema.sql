-- PlacementGap AI Database Schema
-- Compatible with MySQL 8.0+ / Aiven MySQL

CREATE TABLE IF NOT EXISTS candidate_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255),
    email VARCHAR(255),
    target_role VARCHAR(255),
    skills TEXT,
    resume_text LONGTEXT,
    projects_text LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS analyses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    profile_id BIGINT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_description LONGTEXT NOT NULL,
    candidate_resume LONGTEXT,
    candidate_skills TEXT,
    candidate_projects LONGTEXT,
    base_readiness INT NOT NULL DEFAULT 0,
    current_readiness INT NOT NULL DEFAULT 0,
    learning_progress INT NOT NULL DEFAULT 0,
    projects_progress INT NOT NULL DEFAULT 0,
    interview_progress INT NOT NULL DEFAULT 0,
    total_skills INT NOT NULL DEFAULT 0,
    missing_count INT NOT NULL DEFAULT 0,
    weak_count INT NOT NULL DEFAULT 0,
    mastered_count INT NOT NULL DEFAULT 0,
    raw_model_response LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analysis_profile FOREIGN KEY (profile_id) REFERENCES candidate_profiles (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS skill_gaps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analysis_id BIGINT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    classification VARCHAR(50) NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    suggested_proficiency VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_skill_analysis FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE,
    INDEX idx_skill_analysis (analysis_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS roadmap_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analysis_id BIGINT NOT NULL,
    item_order INT NOT NULL DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    detail TEXT,
    resource_url VARCHAR(1000),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_roadmap_analysis FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE,
    INDEX idx_roadmap_analysis (analysis_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
