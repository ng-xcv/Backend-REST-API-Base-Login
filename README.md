# Backend-REST-API-Base-Login

Backend Rest API - Base
Base Login est une application basique Backend Restful API de gestion de la connexion et des autorisations d'accès d'un utilisateur à une route en fonction du profil.

Elle permet :

S'inscrire
Se connecter
Récupérer les utilisateurs en fonction du profil ou de l'ID < Admin>
Modifier un utilisateur < Utilisateur, Admin>
Changement de profil < Admin>
LISTE DES PROFILS

Visiteur
Utilisateur
Admin
User
Récupérer la liste des utilisateurs

Condition : Se connecter et disposer d'un profil Admin

GET
/api/user
http://localhost:5000/api/user
Make things easier for your teammates with a complete request description.
Request Headers
token
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmFkZmMzMjhlMjU5NmIzNzc0NWYzZCIsInByb2ZpbCI6InV0aWxpc2F0ZXVyIiwiaWF0IjoxNjU2NDE1ODg0LCJl...
PUT
/api/user/switchProfil/:id
http://localhost:5000/api/user/switchProfil/:id
Changer de profil

Condition : Se connecter et disposer d'un profil Admin

Request Headers
token
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmFkZmMzMjhlMjU5NmIzNzc0NWYzZCIsInByb2ZpbCI6InV0aWxpc2F0ZXVyIiwiaWF0IjoxNjU2NDE1ODg0LCJl...
Path Variables
id
Bodyraw (json)
json
{
  "profil": "Utilisateur"
}
GET
/api/user/:profil
http://localhost:5000/api/user?profil=
Récupérer la liste des utilisateurs dont profil est : "profil"

Condition : Se connecter et disposer d'un profil Admin

Request Headers
token
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmFkZmMzMjhlMjU5NmIzNzc0NWYzZCIsInByb2ZpbCI6InV0aWxpc2F0ZXVyIiwiaWF0IjoxNjU2NDE1ODg0LCJl...
Query Params
profil
GET
/api/user/:id
http://localhost:5000/api/user/
Récupérer un utilisateur à partir de l'ID

Condition : Se connecter et disposer d'un profil Admin

Request Headers
token
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmFkZmMzMjhlMjU5NmIzNzc0NWYzZCIsInByb2ZpbCI6InV0aWxpc2F0ZXVyIiwiaWF0IjoxNjU2NDE1ODg0LCJl...
PUT
/api/user/:id
http://localhost:5000/api/user/
Modifier un utilisateur

Condition : Se connecter et Être propriétaire du compte ou disposer d'un profil Admin

Request Headers
token
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmFkZmMzMjhlMjU5NmIzNzc0NWYzZCIsInByb2ZpbCI6InV0aWxpc2F0ZXVyIiwiaWF0IjoxNjU2NDE1ODg0LCJl...
Bodyraw (json)
json
{
  "prenom": "Cheikh Ahmadou Ngary",
  "nom": "Faye",
  "email": "ngary@gmail.com",
  "password": "ngary"
}
Auth
S'inscrire

Condition : Aucune

POST
/api/auth/register
http://localhost:5000/api/auth/register
Make things easier for your teammates with a complete request description.
Bodyraw (json)
json
{
  "prenom": "Ahmadou Ngary",
  "nom": "Faye",
  "email": "ngary@gmail.com",
  "password": "ngary",
  "profil": "admin"
}
POST
/api/auth/login
http://localhost:5000/api/auth/login
Se connecter

Condition : S'inscrire au préalable

Bodyraw (json)
json
{
  "email": "@gmail.com",
  "password": ""
}
