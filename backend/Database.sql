CREATE TABLE `User` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE,
  `username` VARCHAR(255) UNIQUE,
  `password` text,
  `birthdate` date,
  `gender` tinyint
);

CREATE TABLE `User_Topics` (
  `user_id` integer,
  `topic_id` integer
);

CREATE TABLE `Topics` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `label` VARCHAR(255),
  `min_age` tinyint
);

CREATE TABLE `Messages` (
  `chat_id` integer,
  `user_id` integer,
  `send_time` timestamp,
  `message_value` text,
  `content_type` VARCHAR(255)
);

CREATE TABLE `Chat` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user1_id` integer,
  `user2_id` integer,
  `persistent` bool
);

ALTER TABLE `Chat` ADD FOREIGN KEY (`user1_id`) REFERENCES `User` (`id`);

ALTER TABLE `Chat` ADD FOREIGN KEY (`user2_id`) REFERENCES `User` (`id`);

ALTER TABLE `Messages` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `Messages` ADD FOREIGN KEY (`chat_id`) REFERENCES `Chat` (`id`);

ALTER TABLE `User_Topics` ADD FOREIGN KEY (`topic_id`) REFERENCES `Topics` (`id`);

ALTER TABLE `User_Topics` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);
