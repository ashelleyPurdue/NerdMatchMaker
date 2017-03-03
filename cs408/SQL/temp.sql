Create Table User(
	UserID int Primary Key AUTO_INCREMENT,
	UserName varchar(30) Not Null Unique,
	Password varchar(30) Not Null,
	Picture varchar(30),
	Birthday_year int Not Null,
	Birthday_month int Not Null,
	Birthday_day int Not Null,
	Gender varchar(2) Not Null,
	GenderInto varchar(2) Not Null,
	loc varchar(45),
	InARelationship boolean DEFAULT false,
	minAge int,
	maxAge int,
	age int
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
