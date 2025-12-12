Supprimer table appRole?
renomer champs bdd sans prefixe + snake_case?


route register : http://localhost:3000/auth/register
body:
{
  "userMail": "test.t@example.com",
  "userName": "toto",
  "userFirstname": "toto",
  "userPass": "toto",
  "aproId": 1
}


user creer avec le post :
{
  "message": "user created",
  "user": {
    "id": "6c48130f-54c9-47f0-b658-a2a7017d7f49"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YzQ4MTMwZi01NGM5LTQ3ZjAtYjY1OC1hMmE3MDE3ZDdmNDkiLCJpYXQiOjE3NjU1NjExOTksImV4cCI6MTc2NTY0NzU5OX0.hIqSLqd1ObQ3gyhYEMyIHElQJmbZBunV0UFAVA71GUs"
}

route login : http://localhost:3000/auth/login
body :
{
  "userMail": "test.t@example.com",
  "userPass": "toto"
}

reponse :

{
  "message": "User logged in",
  "userData": {
    "id": "6c48130f-54c9-47f0-b658-a2a7017d7f49",
    "email": "test.t@example.com",
    "username": "toto"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjU1NjE2OTcsImV4cCI6MTc2NTY0ODA5N30.e1AMNCuK7Pw_UQX8QDmUeUe-Z3U5WrErTyXf0iFsXPI"
}

//TODO
ajouter envoie de mail pour validation à la creation de compte
verifier status au login