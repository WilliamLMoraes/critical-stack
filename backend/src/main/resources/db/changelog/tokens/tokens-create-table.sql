-- changeset william.leite
CREATE TABLE tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    campaign_grid_id bigint NOT NULL,
    name varchar(100) NOT NULL,
    description text,
    type ENUM ('PLAYER', 'NPC', 'CREATURE', 'OBJECT') NOT NULL,
    image_url text NOT NULL,
    rotation float DEFAULT 0,
    tint_color varchar(9),
    pos_x integer DEFAULT 0,
    pos_y integer DEFAULT 0,
    width integer DEFAULT 1,
    height integer DEFAULT 1,
    hp_current int,
    hp_max int,
    is_visible_to_players bool DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
