-- changeset william.leite
ALTER TABLE campaigns_grid
    ADD FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
    ADD FOREIGN KEY (folder_id) REFERENCES campaigns_folders (id);
