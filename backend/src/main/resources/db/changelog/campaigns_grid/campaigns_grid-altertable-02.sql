-- changeset william.leite
ALTER TABLE campaigns_grid
    ADD COLUMN description TEXT,
    ADD COLUMN show_background_image bool DEFAULT false;
