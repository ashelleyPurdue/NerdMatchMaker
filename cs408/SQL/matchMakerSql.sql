Select * from User as U1
Join User as U2 on U1.UserID != U2.UserID
where U1.GenderInto = U2.Gender AND U1.Gender = U2.GenderInto
And (U1.age > U2.minAge AND U1.age < U2.maxAge) 
And (U2.age > U1.minAge AND U2.age < U1.maxAge)
And ((Select Count(*) from UserLanguage as L Join UserLanguage as L2 where L.UserID = U1.UserID AND L2.UserID = U2.UserID)
= (Select Count(*) from UserLanguage as L3 where L3.UserID = U1.UserID))
And ((Select Count(*) from UserLanguage as L Join UserLanguage as L2 where L.UserID = U1.UserID AND L2.UserID = U2.UserID)
= (Select Count(*) from UserLanguage as L4 where L4.UserID = U2.UserID))
AND ((Select Count(*) from User_Interests as UI 
Join User_Interests as UI2 where UI.UserID = U1.UserID AND UI2.UserID = U2.UserID)/
((Select Count(*) from User_Interests where UserID = U1.UserID) + (Select Count(*) from User_Interests where UserID = U2.UserID))) > .25