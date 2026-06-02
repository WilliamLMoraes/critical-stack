-- changeset william.leite
CREATE TABLE campaigns_grid (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_id bigint NOT NULL,
    folder_id bigint,
    name varchar(100) NOT NULL,
    width integer DEFAULT 20,
    height integer DEFAULT 20,
    cell_size integer DEFAULT 32,
    line_color varchar(9) DEFAULT '#cccccc',
    background_color varchar(9) DEFAULT '#1a1a1a',
    show_grid bool DEFAULT true,
    image_background_url text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);