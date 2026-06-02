-- changeset william.leite
CREATE TABLE campaigns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_creator_id bigint NOT NULL,
    name varchar(100) NOT NULL,
    description text,
    url_image varchar(255),
    enabled bool DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
