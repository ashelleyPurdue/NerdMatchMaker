/* Add default interests */
insert into interests(name) values("anime");
insert into interests(name) values("gaming");
insert into interests(name) values("drawing");
insert into interests(name) values("music");
insert into interests(name) values("math");
insert into interests(name) values("programming");
insert into interests(name) values("engineering");
insert into interests(name) values("reading");
insert into interests(name) values("science");
insert into interests(name) values("fantasy");
insert into interests(name) values("sci-fi");
insert into interests(name) values("anime");

/* Add male test users */
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp0","abcd1234","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp1","abcd1234","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp2","1234abcd","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp3","1234abcd","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp4","1234abcd","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp5","1234abcd","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp6","1234abcd","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp7","1234abcd","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp8","1234abcd","02/07/1995","M","F");
Insert INTO User(UserName,Password,Birthday,Gender,GenderInto)
Values("temp9","1234abcd","02/07/1995","M","F");

/* Add female test users */
Insert INTO User(UserName, Password, Birthday, Gender, GenderInto)
Values("Princess", "1234abcd", "02/07/1995", "F", "M");

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


