[Documentation]

## Access to the different APIs:

### i - All Routes require authentication, this is a private API.

---

## I - USER

    1.	POST /auth/singup ---: Allows user to register on the site
    2.	POST /auth/login ----: Allows user to be authenticated on the site

## II - SAUCES

    1.	GET /sauces ----------: Allows user to retrieve the table of sauces
    2.	GET /sauce/:id -------: Allows user to retrieve the information of a specific sauce from its ID
    3.	POST /sauces ---------: Allows user to add a sauce to the list
    4.	PUT /sauces/:id -------: Allows user to update a sauce that he/she has created.
    5.	DELETE /sauces/:id----: Allows user to delete a sauce that he/she has created.
    6.	POST /sauces/:id/like -: Allows all authenticated users to like or dislike a sauce in the list.

---

## [USER]

1. POST /auth/singup
   > POST http://localhost:3000/api/auth/signup

Allows user to register on the site

- Expected: `email: { type: String, required: true, unique: true }, password: { type: String, required: true }`

- JSON response: "Utilisateur Crée!"

---

2. POST /auth/login
   > POST http://localhost:3000/api/auth/login

Allows user to be authenticated on the site

- Expected:
  ` email: { type: String, required: true, unique: true }, password: { type: String, required: true } `

- JSON response: `{"userId":"UID","token":"eyJ....."}`

---

## [SAUCES]

1. GET /sauces
   > GET http://localhost:3000/api/sauces

Allows you to retrieve the table of sauces

- JSON response : {
  "0": {
  "likes": Number,
  "dislikes": Number,
  "usersLiked": [],
  "usersDisliked": [],
  "\_id": "String",
  "name": "String",
  "manufacturer": "String",
  "description": "String",
  "mainPepper": "String",
  "heat": Number,
  "imageUrl": "String",
  "userId": "String",
  "\_\_v": 4
  } ...

---

2. GET /sauce/:id
   > GET http://localhost:3000/api/sauces/60e6ce53bf30d71df94c6902

Allows user to retrieve the information of a specific sauce from its ID

- Expected : /sauce/ID
- JSON response {
  "likes": Number,
  "dislikes": Number,
  "usersLiked": [],
  "usersDisliked": [],
  "\_id": "String",
  "name": "String",
  "manufacturer": "String",
  "description": "String",
  "mainPepper": "String",
  "heat": Number,
  "imageUrl": "String"
  "userId": "String",
  "\_\_v": 4
  }

---

3. POST /sauces
   > POST http://localhost:3000/api/sauces/

Allows user to add a sauce to the list

- Expected: ` name: { type: String, required: true }, manufacturer: { type: String, required: true }, description: { type: String, required: true }, mainPepper: { type: String, required: true }, heat: { type: Number, required: true }, imageUrl: { type: String, required: true }, userId: { type: String, required: true }, likes: { type: Number, required: true, default: 0 }, dislikes: { type: Number, required: true, default: 0 }, usersLiked: [{ type: String }], usersDisliked: [{ type: String }]`

- JSON response :
  {"message":"Objet enregistré !"}

---

4. PUT /sauces/:id
   > PUT http://localhost:3000/api/sauces/60e6ce53bf30d71df94c6902

Allows user to update a sauce that he/she has created.

- Expected : `name / manufacturer / description / mainPepper / heat / imageUrl(facultatif) / userId`
- Answer: Return to the home page & save database changes.

---

5. DELETE /sauces/:id
   > DELETE http://localhost:3000/api/sauces/60e71539021ec6259cd318de

Allows user to delete a sauce that you have created.

- Expected: /sauces/ID

---

6. POST /sauces/:id/like
   > POST http://localhost:3000/api/sauces/60e6ce53bf30d71df94c6902/like

Allows all authenticated users to like or dislike a sauce in the list.

- Expected : `{"userId":"String","like":Number}`
- JSON response : {"message": "Like pris en compte !"}

- -1 dislike
- 0 cancels a choice
- 1 like

---

In case of errors, several messages may be displayed.