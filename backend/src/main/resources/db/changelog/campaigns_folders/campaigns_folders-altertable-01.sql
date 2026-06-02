-- changeset william.leite
ALTER TABLE campaigns_folders
    ADD CONSTRAINT fk_folder_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns (id),
    ADD CONSTRAINT fk_folder_parent FOREIGN KEY (parent_id) REFERENCES campaigns_folders (id);