-- changeset william.leite
ALTER TABLE tokens ADD FOREIGN KEY (campaign_grid_id) REFERENCES campaigns_grid (id);

