/* Add default interests */
insert into Interests(name) values("anime");
insert into Interests(name) values("gaming");
insert into Interests(name) values("drawing");
insert into Interests(name) values("music");
insert into Interests(name) values("math");
insert into Interests(name) values("programming");
insert into Interests(name) values("engineering");
insert into Interests(name) values("reading");
insert into Interests(name) values("science");
insert into Interests(name) values("fantasy");
insert into Interests(name) values("sci-fi");

/* Add male test users */
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp0", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp1", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp2", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp3", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp4", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp5", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp6", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp7", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp8", "abcd1234", 1995, 02, 07, "M", "F");
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("temp9", "abcd1234", 1995, 02, 07, "M", "F");

/* Add female test users */
Insert INTO User(UserName, Password, Birthday_Year, Birthday_Month, Birthday_Day, Gender, GenderInto)
Values("Princess", "1234abcd", 1995, 02, 07, "F", "M");

/* Give the males interests */
insert into User_Interests(userid, interestid) values(1, 1);
insert into User_Interests(userid, interestid) values(2, 2);
insert into User_Interests(userid, interestid) values(3, 3);
insert into User_Interests(userid, interestid) values(4, 4);
insert into User_Interests(userid, interestid) values(5, 5);
insert into User_Interests(userid, interestid) values(6, 6);
insert into User_Interests(userid, interestid) values(7, 7);
insert into User_Interests(userid, interestid) values(8, 8);
insert into User_Interests(userid, interestid) values(9, 9);

/* Give the females interests */
insert into User_Interests(userid, interestid) values(11, 1);

/* Add matches so we can test messages */
Insert Into Matches
Values(1,2,false,null);
Insert Into Matches
Values(1,3,false,null);
Insert Into Matches
Values(1,4,false,null);
Insert Into Matches
Values(1,5,true,1);
Insert Into Matches
Values(1,6,false,null);
Insert Into Matches
Values(1,7,false,null);
Insert Into Matches
Values(1,8,false,null);
Insert Into Matches
Values(1,9,true,1);
Insert Into Matches
Values(2,3,true,2);
Insert Into Matches
Values(2,4,false,null);

/* Add messages */
Insert Into Messages (UserID1,UserID2,Message)
Values(1,2,"Hello");
Insert Into Messages (UserID1,UserID2,Message)
Values(1,2,"World");
Insert Into Messages (UserID1,UserID2,Message)
Values(2,1,"GoodBye");
Insert Into Messages (UserID1,UserID2,Message)
Values(2,3,"I will miss you");


