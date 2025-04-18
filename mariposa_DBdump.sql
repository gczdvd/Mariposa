-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 12, 2025 at 10:25 AM
-- Server version: 8.0.41-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mariposa`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `authUser` (IN `_email` TINYTEXT, IN `_key` TEXT, IN `_wanted` TEXT)  SELECT client_id FROM User WHERE email = _email AND (SELECT SHA2(CONCAT(_key, (SELECT password FROM User WHERE email = _email)), 256) = _wanted) AND verify = 'OK'$$

CREATE DEFINER=`root`@`%` PROCEDURE `deleteUser` (IN `_id` INT)  BEGIN
	IF (SELECT count(*) FROM Client WHERE id = _id) THEN
    	SET @mail = (SELECT email FROM User WHERE client_id = _id);
    	SET @n = (SELECT COUNT(*) FROM User WHERE email LIKE (CONCAT('%', @mail, '%') COLLATE "utf8mb4_hungarian_ci"));
        UPDATE User SET verify = 'DELETED', email = CONCAT(@n, "@", @mail) WHERE client_id = _id;
        SELECT "Success" AS "status";
    ELSE
    	SELECT "Failed" AS "status";
    END IF;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `forgotPassword` (IN `_email` VARCHAR(255), IN `_newPass` TEXT)  BEGIN

	IF (SELECT COUNT(*) FROM User WHERE email = _email AND verify = "OK") > 0 THEN
		UPDATE User SET password = _newPass WHERE email = _email;
        SELECT "Success" AS "status";
	ELSE
    	SELECT "Fail" AS "status";
	END IF;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `getChatById` (IN `_id` INT)  BEGIN
	
    SELECT * FROM Chat WHERE id = _id;
    
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `getChatByUsers` (IN `_cid1` INT, IN `_cid2` INT)  BEGIN

	SET @exID = (SELECT id FROM Chat WHERE ((client1_id = _cid1 AND client2_id = _cid2) OR (client1_id = _cid2 AND client2_id = _cid1)));
	IF (@exID) THEN
    	SELECT @exID AS "id", su.persistent AS "persistent" FROM (SELECT * FROM Chat WHERE id = @exID) AS su;
    ELSE
    	INSERT INTO Chat (persistent, client1_id, client2_id) VALUES (0, _cid1, _cid2);
        SET @LaID = LAST_INSERT_ID();
		SELECT @LaID AS "id", su.persistent AS "persistent" FROM (SELECT * FROM Chat WHERE id = @LaID) AS su;
    END IF;

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `getClient` (IN `_id` INT)  BEGIN

SET @typ = (SELECT type FROM Client WHERE id = _id);
SET @execu = CONCAT('SELECT Client.type, ', @typ, '.* FROM Client, ', @typ, ' WHERE Client.id = ', _id, ' AND ', @typ, '.client_id = ', _id);
PREPARE getClient FROM @execu;
EXECUTE getClient;

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `getMessages` (IN `_chatid` INT, IN `_lastdate` DATETIME)  BEGIN

SELECT * FROM (SELECT * FROM Messages WHERE chat_id = _chatid AND _lastdate > send_time ORDER BY send_time DESC LIMIT 20) AS su ORDER BY su.send_time ASC;

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `getSavedChatsByUserId` (IN `_id` INT)  SELECT a.* FROM
(
   SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
   FROM Chat, User
   WHERE Chat.persistent = 1 AND Chat.client1_id = _id AND Chat.client2_id = User.client_id

   UNION

   SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
   FROM Chat, User
   WHERE Chat.persistent = 1 AND Chat.client2_id = _id AND Chat.client1_id = User.client_id
) AS a,
(
    SELECT chat_id, MAX(send_time) AS lasttime
    FROM Messages
    GROUP BY chat_id
) AS b
WHERE a.chat_id = b.chat_id
ORDER BY b.lasttime DESC$$

CREATE DEFINER=`root`@`%` PROCEDURE `getUserByEmail` (IN `_email` TEXT)  SELECT client_id FROM User WHERE email = _email AND verify = 'OK'$$

CREATE DEFINER=`root`@`%` PROCEDURE `isExistEmail` (IN `_email` TEXT)  BEGIN

IF (SELECT COUNT(*) FROM User WHERE email = _email AND verify = "OK") > 0 THEN
	SELECT 1 as "exist";
ELSE
	SELECT 0 as "exist";
END IF;

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `modifyUser` (IN `_id` INT, IN `_password` TEXT, IN `_gender` TINYINT, IN `_description` TEXT, IN `_profile_pic` TEXT, IN `_topics` JSON, IN `_birthdate` DATE, IN `_nickname` VARCHAR(255))  BEGIN

IF _password != "" THEN
	UPDATE User SET password = _password WHERE client_id = _id;
END IF;

IF _gender != -1 THEN
	UPDATE User SET gender = _gender WHERE client_id = _id;
END IF;

IF _description != "" THEN
	UPDATE User SET description = _description WHERE client_id = _id;
END IF;

IF _profile_pic != "" THEN
	UPDATE User SET profile_pic = _profile_pic WHERE client_id = _id;
END IF;

IF _topics != "" THEN
	UPDATE User SET topics = _topics WHERE client_id = _id;
END IF;

IF _birthdate != "1000-01-01" THEN
	UPDATE User SET birthdate = _birthdate WHERE client_id = _id;
END IF;

IF _nickname != "" THEN
	UPDATE User SET nickname = _nickname WHERE client_id = _id;
END IF;

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `newGuest` (IN `_ip` VARCHAR(255))  BEGIN

INSERT INTO Client (type) VALUES ("Guest");
SET @li = LAST_INSERT_ID();
INSERT INTO Guest (client_id, ip, timestamp) VALUES (@li, _ip, CURRENT_TIMESTAMP());
SELECT @li as "client_id";

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `newMessage` (IN `_chatid` INT, IN `_cid` INT, IN `_msg` TEXT, IN `_type` VARCHAR(255))  BEGIN

INSERT INTO Messages (chat_id, client_id, message_value, content_type, send_time) VALUES (_chatid, _cid, _msg, _type, CURRENT_TIMESTAMP());

END$$

CREATE DEFINER=`root`@`%` PROCEDURE `setChatPersistent` (IN `_chatid` INT, IN `_value` INT)  BEGIN

IF (SELECT COUNT(*) FROM Chat WHERE id = _chatid) > 0 THEN
	UPDATE Chat SET persistent = _value WHERE id = _chatid;
    SELECT 1 AS "status";
ELSE
	SELECT 0 AS "status";
END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `signupUser` (IN `_nickname` VARCHAR(255), IN `_email` VARCHAR(255), IN `_password` TEXT, IN `_verify` TEXT)  MODIFIES SQL DATA
BEGIN
    SET @exis = (SELECT (SELECT COUNT(*) FROM User WHERE email = _email) > 0 AS "email");

    IF @exis = 0 THEN
        INSERT INTO Client (type) VALUES ("User");
        INSERT INTO User (client_id, email, nickname, password, birthdate, gender, description, verify, profile_pic, topics) VALUES (LAST_INSERT_ID(), _email, _nickname, _password, NULL, NULL, NULL, _verify, 'default.png', '[]');
        SELECT "Success" as "status";
    ELSE
        SELECT "Exist" as "status";
    END IF;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `verifyUser` (IN `_token` TEXT)  BEGIN
	IF (SELECT count(*) FROM User WHERE verify = _token AND _token != "OK" AND _token != "DELETED") > 0 THEN
        SELECT "Success" AS "status", client_id FROM User WHERE verify = _token;
    	UPDATE User SET verify = "OK" WHERE verify = _token;
    ELSE
    	SELECT "Failed" AS "status";
    END IF;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `_deleteUserOld` (IN `_id` INT)  BEGIN
	IF (SELECT count(*) FROM Client WHERE id = _id) THEN
        DELETE FROM User WHERE client_id = _id;
        DELETE FROM Client WHERE id = _id;
        SELECT "Success" AS "status";
    ELSE
    	SELECT "Failed" AS "status";
    END IF;
END$$

CREATE DEFINER=`root`@`%` PROCEDURE `_getSavedChatsByUserId` (IN `_id` INT)  BEGIN

SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
FROM Chat, User
WHERE Chat.persistent = 1 AND Chat.client1_id = _id AND Chat.client2_id = User.client_id

UNION

SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
FROM Chat, User
WHERE Chat.persistent = 1 AND Chat.client2_id = _id AND Chat.client1_id = User.client_id;

END$$

DELIMITER ;


CREATE TABLE `Chat` (
  `id` int NOT NULL,
  `client1_id` int DEFAULT NULL,
  `client2_id` int DEFAULT NULL,
  `persistent` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


CREATE TABLE `Client` (
  `id` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


--
-- Table structure for table `Guest`
--

CREATE TABLE `Guest` (
  `client_id` int NOT NULL,
  `ip` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Messages`
--

CREATE TABLE `Messages` (
  `chat_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `send_time` timestamp NULL DEFAULT NULL,
  `message_value` text COLLATE utf8mb4_hungarian_ci,
  `content_type` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `Messages`
--

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `client_id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_hungarian_ci DEFAULT NULL,
  `password` text COLLATE utf8mb4_hungarian_ci,
  `birthdate` date DEFAULT NULL,
  `gender` tinyint DEFAULT NULL,
  `description` text COLLATE utf8mb4_hungarian_ci,
  `verify` text COLLATE utf8mb4_hungarian_ci NOT NULL,
  `profile_pic` text COLLATE utf8mb4_hungarian_ci NOT NULL,
  `topics` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Indexes for table `Chat`
--
ALTER TABLE `Chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client1_id` (`client1_id`),
  ADD KEY `client2_id` (`client2_id`);

--
-- Indexes for table `Client`
--
ALTER TABLE `Client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Guest`
--
ALTER TABLE `Guest`
  ADD PRIMARY KEY (`client_id`);

--
-- Indexes for table `Messages`
--
ALTER TABLE `Messages`
  ADD KEY `client_id` (`client_id`),
  ADD KEY `chat_id` (`chat_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`client_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Chat`
--
ALTER TABLE `Chat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `Client`
--
ALTER TABLE `Client`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Chat`
--
ALTER TABLE `Chat`
  ADD CONSTRAINT `Chat_ibfk_1` FOREIGN KEY (`client1_id`) REFERENCES `Client` (`id`),
  ADD CONSTRAINT `Chat_ibfk_2` FOREIGN KEY (`client2_id`) REFERENCES `Client` (`id`);

--
-- Constraints for table `Guest`
--
ALTER TABLE `Guest`
  ADD CONSTRAINT `Guest_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Client` (`id`);

--
-- Constraints for table `Messages`
--
ALTER TABLE `Messages`
  ADD CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Client` (`id`),
  ADD CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`chat_id`) REFERENCES `Chat` (`id`);

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `Client` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `_deleteUserOld`(IN `_id` INT)
BEGIN
	IF (SELECT count(*) FROM Client WHERE id = _id) THEN
        DELETE FROM User WHERE client_id = _id;
        DELETE FROM Client WHERE id = _id;
        SELECT "Success" AS "status";
    ELSE
    	SELECT "Failed" AS "status";
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `_getSavedChatsByUserId`(IN `_id` INT)
BEGIN

SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
FROM Chat, User
WHERE Chat.persistent = 1 AND Chat.client1_id = _id AND Chat.client2_id = User.client_id

UNION

SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
FROM Chat, User
WHERE Chat.persistent = 1 AND Chat.client2_id = _id AND Chat.client1_id = User.client_id;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `authUser`(IN `_email` TINYTEXT, IN `_key` TEXT, IN `_wanted` TEXT)
SELECT client_id FROM User WHERE email = _email AND (SELECT SHA2(CONCAT(_key, (SELECT password FROM User WHERE email = _email)), 256) = _wanted) AND verify = 'OK'$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteUser`(IN `_id` INT)
BEGIN
	IF (SELECT count(*) FROM Client WHERE id = _id) THEN
    	SET @mail = (SELECT email FROM User WHERE client_id = _id);
    	SET @n = (SELECT COUNT(*) FROM User WHERE email LIKE (CONCAT('%', @mail, '%') COLLATE "utf8mb4_hungarian_ci"));
        UPDATE User SET verify = 'DELETED', email = CONCAT(@n, "@", @mail) WHERE client_id = _id;
        SELECT "Success" AS "status";
    ELSE
    	SELECT "Failed" AS "status";
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `forgotPassword`(IN `_email` VARCHAR(255), IN `_newPass` TEXT)
BEGIN

	IF (SELECT COUNT(*) FROM User WHERE email = _email AND verify = "OK") > 0 THEN
		UPDATE User SET password = _newPass WHERE email = _email;
        SELECT "Success" AS "status";
	ELSE
    	SELECT "Fail" AS "status";
	END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `getChatById`(IN `_id` INT)
BEGIN
	
    SELECT * FROM Chat WHERE id = _id;
    
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `getChatByUsers`(IN `_cid1` INT, IN `_cid2` INT)
BEGIN

	SET @exID = (SELECT id FROM Chat WHERE ((client1_id = _cid1 AND client2_id = _cid2) OR (client1_id = _cid2 AND client2_id = _cid1)));
	IF (@exID) THEN
    	SELECT @exID AS "id", su.persistent AS "persistent" FROM (SELECT * FROM Chat WHERE id = @exID) AS su;
    ELSE
    	INSERT INTO Chat (persistent, client1_id, client2_id) VALUES (0, _cid1, _cid2);
        SET @LaID = LAST_INSERT_ID();
		SELECT @LaID AS "id", su.persistent AS "persistent" FROM (SELECT * FROM Chat WHERE id = @LaID) AS su;
    END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `getClient`(IN `_id` INT)
BEGIN

SET @typ = (SELECT type FROM Client WHERE id = _id);
SET @execu = CONCAT('SELECT Client.type, ', @typ, '.* FROM Client, ', @typ, ' WHERE Client.id = ', _id, ' AND ', @typ, '.client_id = ', _id);
PREPARE getClient FROM @execu;
EXECUTE getClient;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `getMessages`(IN `_chatid` INT, IN `_lastdate` DATETIME)
BEGIN

SELECT * FROM (SELECT * FROM Messages WHERE chat_id = _chatid AND _lastdate > send_time ORDER BY send_time DESC LIMIT 20) AS su ORDER BY su.send_time ASC;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `getSavedChatsByUserId`(IN `_id` INT)
SELECT a.* FROM
(
   SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
   FROM Chat, User
   WHERE Chat.persistent = 1 AND Chat.client1_id = _id AND Chat.client2_id = User.client_id

   UNION

   SELECT User.profile_pic, User.nickname as partner_name, Chat.id as chat_id, User.client_id as user_id
   FROM Chat, User
   WHERE Chat.persistent = 1 AND Chat.client2_id = _id AND Chat.client1_id = User.client_id
) AS a,
(
    SELECT chat_id, MAX(send_time) AS lasttime
    FROM Messages
    GROUP BY chat_id
) AS b
WHERE a.chat_id = b.chat_id
ORDER BY b.lasttime DESC$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `getUserByEmail`(IN `_email` TEXT)
SELECT client_id FROM User WHERE email = _email AND verify = 'OK'$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `isExistEmail`(IN `_email` TEXT)
BEGIN

IF (SELECT COUNT(*) FROM User WHERE email = _email AND verify = "OK") > 0 THEN
	SELECT 1 as "exist";
ELSE
	SELECT 0 as "exist";
END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `modifyUser`(IN `_id` INT, IN `_password` TEXT, IN `_gender` TINYINT, IN `_description` TEXT, IN `_profile_pic` TEXT, IN `_topics` JSON, IN `_birthdate` DATE, IN `_nickname` VARCHAR(255))
BEGIN

IF _password != "" THEN
	UPDATE User SET password = _password WHERE client_id = _id;
END IF;

IF _gender != -1 THEN
	UPDATE User SET gender = _gender WHERE client_id = _id;
END IF;

IF _description != "" THEN
	UPDATE User SET description = _description WHERE client_id = _id;
END IF;

IF _profile_pic != "" THEN
	UPDATE User SET profile_pic = _profile_pic WHERE client_id = _id;
END IF;

IF _topics != "" THEN
	UPDATE User SET topics = _topics WHERE client_id = _id;
END IF;

IF _birthdate != "1000-01-01" THEN
	UPDATE User SET birthdate = _birthdate WHERE client_id = _id;
END IF;

IF _nickname != "" THEN
	UPDATE User SET nickname = _nickname WHERE client_id = _id;
END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `newGuest`(IN `_ip` VARCHAR(255))
BEGIN

INSERT INTO Client (type) VALUES ("Guest");
SET @li = LAST_INSERT_ID();
INSERT INTO Guest (client_id, ip, timestamp) VALUES (@li, _ip, CURRENT_TIMESTAMP());
SELECT @li as "client_id";

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `newMessage`(IN `_chatid` INT, IN `_cid` INT, IN `_msg` TEXT, IN `_type` VARCHAR(255))
BEGIN

INSERT INTO Messages (chat_id, client_id, message_value, content_type, send_time) VALUES (_chatid, _cid, _msg, _type, CURRENT_TIMESTAMP());

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `setChatPersistent`(IN `_chatid` INT, IN `_value` INT)
BEGIN

IF (SELECT COUNT(*) FROM Chat WHERE id = _chatid) > 0 THEN
	UPDATE Chat SET persistent = _value WHERE id = _chatid;
    SELECT 1 AS "status";
ELSE
	SELECT 0 AS "status";
END IF;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `signupUser`(IN `_nickname` VARCHAR(255), IN `_email` VARCHAR(255), IN `_password` TEXT, IN `_verify` TEXT)
    MODIFIES SQL DATA
BEGIN
    SET @exis = (SELECT (SELECT COUNT(*) FROM User WHERE email = _email) > 0 AS "email");

    IF @exis = 0 THEN
        INSERT INTO Client (type) VALUES ("User");
        INSERT INTO User (client_id, email, nickname, password, birthdate, gender, description, verify, profile_pic, topics) VALUES (LAST_INSERT_ID(), _email, _nickname, _password, NULL, NULL, NULL, _verify, 'default.png', '[]');
        SELECT "Success" as "status";
    ELSE
        SELECT "Exist" as "status";
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `verifyUser`(IN `_token` TEXT)
BEGIN
	IF (SELECT count(*) FROM User WHERE verify = _token AND _token != "OK" AND _token != "DELETED") > 0 THEN
        SELECT "Success" AS "status", client_id FROM User WHERE verify = _token;
    	UPDATE User SET verify = "OK" WHERE verify = _token;
    ELSE
    	SELECT "Failed" AS "status";
    END IF;
END$$
DELIMITER ;