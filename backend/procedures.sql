/*getClient*/
SET @typ = (SELECT type FROM Client WHERE id = _id);
SET @execu = CONCAT('SELECT Client.type, ', @typ, '.* FROM Client, ', @typ, ' WHERE Client.id = ', _id, ' AND ', @typ, '.client_id = ', _id);
PREPARE getClient FROM @execu;
EXECUTE getClient;

/*signupUser*/
BEGIN
    SET @exis = (SELECT (SELECT COUNT(*) FROM User WHERE email = _email) > 0 AS "email");

    IF @exis = 0 THEN
        INSERT INTO Client (type) VALUES ("User");
        INSERT INTO User (client_id, email, nickname, password, birthdate, gender, description, verify) VALUES (LAST_INSERT_ID(), _email, _nickname, _password, _birthdate, _gender, _description, _verify);
        SELECT "Success" as "status";
    ELSE
        SELECT "Exist" as "status";
    END IF;
END