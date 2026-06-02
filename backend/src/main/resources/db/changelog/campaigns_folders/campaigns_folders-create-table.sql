-- changeset william.leite
CREATE TABLE campaigns_folders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id bigint NOT NULL,
    parent_id bigint,
    name varchar(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);