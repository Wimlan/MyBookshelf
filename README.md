**BACKEND**

---

USER API

---

**POST: Sign In**<br>
http://localhost:3000/user/signin<br>

=>Email and Password is sent in body. JSON Format:<br><br>
{
"email": "example@gmail.com",
"password": "examplepassword"
}

<br><br>
TEST: "email": "wilma.yasuda@gmail.com",<br>
"password": "mysecret" <br>
<br><br>
**GET: Sign Out**<br>
http://localhost:3000/user/signout<br>
<br>
**POST: Create User**<br>
http://localhost:3000/user/signup<br>

=>Username, Email and Password is sent in body. JSON Format:<br><br>
{
"username": "userexample",
"email": "example@gmail.com",
"password": "examplepassword"
}
<br><br>

**DELETE: Delete User**<br>
http://localhost:3000/user/delete/<br>

=>Body: user password is required in body<br>
<br><br>

---

BOOKS API

---

-----_FOR ADMIN_-----<br><br>
**GET: Get all books and check with query if verified(Sign in not needed)**<br>
http://localhost:3000/books/notverified<br>
<br>
**PATCH: Verify book and add to shelf(Sign in not needed)**<br>
http://localhost:3000/books/verify/:bookid<br>
<br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>
-----_FOR USER_-----<br><br>
**GET: for the frontend Title Search Function**<br>
http://localhost:3000/books/search?title=WORD<br>
<br>
=>Replace WORD with the word you want to search for<br>
<br>
**GET: Gets a users whole bookshelf. For mapping out a users bookshelf in frontend**<br>
http://localhost:3000/books/bookshelf/<br>
<br>
<br>
**POST: Adds a new book to the Books table**<br>
http://localhost:3000/books/addbook/:id?genre=GENRE<br>
<br>
=>Book is sent in body. JSON Format:<br><br>
{
"title": "A Wizard of Earthsea",
"author": "Ursula K. Le Guin",
"year": 1968,
"synopsis": "Follows Ged, a young boy with extraordinary magical talent, who grows up on a poor island and earns a place at a school for wizards. Driven by pride and rivalry, he unleashes a terrifying shadow creature upon the world and must journey across the seas to confront it.",
"image": "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1395227142i/979685.jpg"
}
<br><br>
=>Adressparameter (:id): Id of the user in session.<br>
=>GENRE is to be replaced with the book genre(See GENRES below)<br>
=>Needs to be verified after in order to show up in users bookshelf<br>
<br>
**POST: Adds a new book to the users bookshelf**<br>
http://localhost:3000/books/addtoshelf/:id/:bookid<br>
<br>
=>Adressparameter (:id): Id of the user in session.<br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>
**POST: Adds a TAG to a book in the users bookshelf**<br>
http://localhost:3000/books/addtag/:id/:bookid<br>

=>Tag is sent in body. JSON Format:<br><br>
{"tag" : "Borrowing"}
<br><br>
=>Adressparameter (:id): Id of the user in session.<br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>

**DELETE: deleting a TAG from users bookshelf**<br>
http://localhost:3000/books/removetag/:id/:bookid<br>

=>Tag is sent in body. JSON Format:<br><br>
{"tag" : "Borrowing"}
<br><br>
=>Adressparameter (:id): Id of the user in session.<br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>

**DELETE: deleting a book from a users bookshelf**<br>
http://localhost:3000/books/removefromshelf/:id/:bookid<br>

=>Adressparameter (:id): Id of the user in session.<br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>

---

**GENRES:**
'Literary Fiction'
'Mystery'
'Thriller'
'Science Fiction'
'Fantasy'
'Romance'
'Horror'
'Historical Fiction'
'Adventure'
'Graphic Novel'
'Biography'
'Autobiography'
'Memoir'
'Self-Help'
'History'
'True Crime'
'Science'
'Nature'
'Business'
'Finance'
'Travel'
'Cooking'
'Religion'
'Spirituality'
'Politics'
'Philosophy'
'Health'
'Wellness'
'Picture Books'
'Middle Grade'
'Young Adult'
'Fiction'
'Non-Fiction'

---

**TAGS:** 'Read' 'To Read' 'Reading' 'Loaned' 'Borrowing' 'Abandoned' 'Re-Reading' 'Re-Read' 'Favourite'
