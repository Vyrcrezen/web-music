CREATE TABLE `user_account` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `user_name` varchar(16) NOT NULL,
  `hash_id` smallint unsigned,
  `user_email` varchar(64) NOT NULL,
  `user_password` varchar(128) NOT NULL,
  `clearance` tinyint NOT NULL,
  `registration_time` bigint unsigned NOT NULL,
  `last_online` bigint unsigned NOT NULL
);

CREATE TABLE `tag` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(32) UNIQUE NOT NULL
);

CREATE TABLE `tag_pairing` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `tag_id` int unsigned NOT NULL,
  `music_id` int unsigned NOT NULL
);

CREATE TABLE `artist` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(64) UNIQUE NOT NULL
);

CREATE TABLE `record_label` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(64) UNIQUE NOT NULL
);

CREATE TABLE `publisher` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(64) UNIQUE NOT NULL
);

CREATE TABLE `user_favourite` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `music_id` int unsigned NOT NULL
);

CREATE TABLE `user_rating` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `music_id` int unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL
);

CREATE TABLE `music` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `upload_time` bigint unsigned NOT NULL,
  `uploader_id` int unsigned NOT NULL,
  `edit_time` bigint unsigned,
  `editor_id` int unsigned,
  `title` varchar(128) NOT NULL,
  `artist_id` int unsigned,
  `record_label_id` int unsigned,
  `publisher_id` int unsigned,
  `album` varchar(64),
  `link` varchar(128),
  `num_played` integer unsigned,
  `avg_rating` double,
  `price` double,
  `currency` varchar(3)
);

ALTER TABLE `tag_pairing` ADD FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`);

ALTER TABLE `tag_pairing` ADD FOREIGN KEY (`music_id`) REFERENCES `music` (`id`);

ALTER TABLE `user_favourite` ADD FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

ALTER TABLE `user_favourite` ADD FOREIGN KEY (`music_id`) REFERENCES `music` (`id`);

ALTER TABLE `user_rating` ADD FOREIGN KEY (`music_id`) REFERENCES `music` (`id`);

ALTER TABLE `user_rating` ADD FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`);

ALTER TABLE `music` ADD FOREIGN KEY (`uploader_id`) REFERENCES `user_account` (`id`);

ALTER TABLE `music` ADD FOREIGN KEY (`editor_id`) REFERENCES `user_account` (`id`);

ALTER TABLE `music` ADD FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

ALTER TABLE `music` ADD FOREIGN KEY (`record_label_id`) REFERENCES `record_label` (`id`);

ALTER TABLE `music` ADD FOREIGN KEY (`publisher_id`) REFERENCES `publisher` (`id`);

CREATE INDEX user_account_ix01 ON user_account (user_name);
CREATE UNIQUE INDEX user_account_ux01 ON user_account (user_email);

CREATE UNIQUE INDEX tag_ux01 ON tag (`name`);

CREATE INDEX tag_pairing_ix01 ON tag_pairing (tag_id);
CREATE INDEX tag_pairing_ix02 ON tag_pairing (music_id);

CREATE UNIQUE INDEX artist_ux01 ON artist (`name`);

CREATE UNIQUE INDEX record_label_ux01 ON record_label (`name`);

CREATE UNIQUE INDEX publisher_ux01 ON publisher (`name`);

CREATE INDEX user_favourite_ix01 ON user_favourite (user_id);
CREATE INDEX user_favourite_ix02 ON user_favourite (music_id);

CREATE INDEX user_rating_ix01 ON user_rating (user_id);
CREATE INDEX user_rating_ix02 ON user_rating (music_id);

CREATE INDEX music_ix01 ON music (title);
CREATE INDEX music_ix02 ON music (artist_id);
CREATE INDEX music_ix03 ON music (avg_rating);
