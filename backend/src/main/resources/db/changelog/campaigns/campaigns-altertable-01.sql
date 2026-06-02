-- changeset william.leite
ALTER TABLE campaigns ADD FOREIGN KEY (user_creator_id) REFERENCES users (id);
