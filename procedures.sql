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
