Create Table GlobalVars(
	current_date_var DATE 
);
INSERT INTO GlobalVars(current_date_var) VALUES(CURDATE());

Create Table User(
	UserID int Primary Key AUTO_INCREMENT,
	UserName varchar(30) Not Null Unique,
	Password varchar(30) Not Null,
	Picture varchar(1000),
	Birthday_year int Not Null,
	Birthday_month int Not Null,
	Birthday_day int Not Null,
	Birthdate DATE As (STR_TO_DATE(CONCAT (Birthday_day, '/', Birthday_month, '/', Birthday_year), '%d/%m/%Y')),
	Age int As (DATEDIFF(SELECT current_date_var FROM GlobalVars, Birthdate)),
	Gender varchar(2) Not Null,
	GenderInto varchar(2) Not Null,
	loc varchar(45),
	InARelationship boolean DEFAULT false,
	minAge int,
	maxAge int
	/*age int*/
);
Create Table Interests(
	InterestID int Primary Key AUTO_INCREMENT,
	Name varchar(45) Not Null Unique,
	Description varchar(200)
);
Create Table Language(
	LanguageID int PRIMARY Key AUTO_INCREMENT,
	Name varchar(30) Not Null
);
Create Table User_Interests(
	UserID int Not Null,
	InterestID int Not Null,
	FOREIGN KEY (UserID) REFERENCES User(UserID),
	FOREIGN KEY (InterestID) REFERENCES Interests(InterestID),
	UNIQUE(UserID,InterestID)
);
Create Table Matches(
	UserID1 int Not Null,
	UserID2 int Not Null,
	IsBlocked boolean default false,
	BlockingID int Null,
	FOREIGN KEY (UserID1) REFERENCES User(UserID),
	FOREIGN KEY (UserID2) REFERENCES User(UserID),
	Unique(UserID1,UserID2)
);
Create Table UserLanguage(
	UserID int Not Null,
	LanguageID int Not Null,
	Foreign Key (UserID) REFERENCES User(UserID),
	FOREIGN Key (LanguageID) REFERENCES Language(LanguageID)
);
Create Table Messages(
	MessageID int Primary Key AUTO_INCREMENT,
	UserID1 int Not Null,
	UserID2 int Not Null,
	Message_Title varchar(100),
	Message varchar(500) Not Null,
	UserID1_Read boolean Default true,
	UserID2_Read boolean Default false,
	FOREIGN KEY (UserID1) REFERENCES User(UserID),
	FOREIGN KEY (UserID2) REFERENCES User(UserID)
);

DROP PROCEDURE IF EXISTS update_matches_procedure;
DELIMITER //
CREATE PROCEDURE update_matches_procedure()
BEGIN

	CREATE TEMPORARY TABLE defaultBlockedInfo(
		IsBlocked tinyint(1),
		BlockingID int(11)
	);

	INSERT INTO defaultBlockedInfo VALUES (0, 0);

	INSERT IGNORE INTO matches
		SELECT ui1.UserID, ui2.UserID, defaultBlockedInfo.IsBlocked, defaultBlockedInfo.BlockingID
			FROM user_interests AS ui1, user_interests AS ui2, user AS u1, user AS u2, defaultBlockedInfo
			WHERE ui1.UserID <> ui2.UserID
				AND ui1.UserID < ui2.UserID
				AND ui1.InterestID = ui2.InterestID
				AND u1.UserID = ui1.UserID
				AND u2.UserID = ui2.UserID
				AND u1.Gender = u2.GenderInto
				AND u2.Gender = u1.GenderInto
				AND u2.age >= u1.minAge
				AND u2.age <= u1.maxAge
				AND u1.age >= u2.minAge
				AND u1.age <= u2.maxAge
	;

	DROP TABLE defaultBlockedInfo;

END//
DELIMITER ;
