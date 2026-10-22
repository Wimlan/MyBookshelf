LÄNK HEMSIDA: https://mybookshelf-gd5p.onrender.com

## Google authentication setup

Use the same Google OAuth **Web application client ID** in both applications.
Google Identity Services handles Google sign-in; the backend uses
`google-auth-library` to verify the ID token's signature, issuer, audience and
expiry, and requires a verified email. Accounts are identified by Google's `sub`,
not by an email match. There is no automatic linking to password accounts.

### Local development

1. In `backend`, configure `.env` using `.env.example`: `PGURI`, a strong
   `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, and `APP_ORIGIN=http://localhost:5173`.
2. Run `npm install` in `backend`. Ensure the database has the Google identity
   schema described below; apply the SQL manually if needed.
3. Run `npm run dev` in `backend` (port 3000).
4. Configure `frontend/.env.local` using `frontend/.env.example`, setting
   `VITE_GOOGLE_CLIENT_ID` to the same client ID. Run `npm install` and
   `npm run dev` in `frontend`.
5. Open exactly `http://localhost:5173` and authorize that origin in Google Cloud.
   Mutation requests require an `Origin` matching `APP_ORIGIN`; API clients must
   send that header too. Restart services after changing environment variables.

For an existing `Users` table, run this SQL directly in your database's SQL editor
to add Google identity support. These changes have already been applied to the
database used during local setup; no further action is needed for that database.
The SQL is safe to rerun and does not delete accounts or bookshelf data.

```sql
BEGIN;

ALTER TABLE Users ADD COLUMN IF NOT EXISTS google_sub text;
CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_key ON Users (google_sub);
ALTER TABLE Users ALTER COLUMN password DROP NOT NULL;

COMMIT;
```

All database queries and session storage share a PostgreSQL pool. Idle connection
errors are logged; the pool removes failed idle connections instead of an
always-open client crashing the backend when the database disconnects.

Never use a client secret in the frontend. This flow needs only the public client
ID. Neither application logs or stores Google ID tokens.

For production, ensure the deployment database has the same schema (apply the SQL
above if needed), configure
`APP_ORIGIN=https://mybookshelf-gd5p.onrender.com`, set `NODE_ENV=production`,
and supply the same Google client ID in the backend and frontend build
environment. Production sessions use HttpOnly, Secure, SameSite=Lax cookies,
with one trusted reverse proxy (as on Render). Authorize the production origin
in Google Cloud.

### Account flow

- First Google sign-in creates a pending, unauthenticated signup session lasting
  at most ten minutes. Users then choose a case-sensitive, unique username of
  3-30 letters, numbers, underscores or hyphens.
- Completing signup creates the account and regenerates/saves the app session.
  Returning Google users keep their chosen username.
- Pending signup does not grant access to bookshelf APIs.
- Deletion requires an app session and a Google ID token for that account,
  issued within the last five minutes. Bookshelf tags, bookshelf entries and the
  account are deleted in one transaction. Shared book records are retained.
  The app session is destroyed afterward. This does not delete the Google account
  or revoke consent in Google Account settings.
- Existing password account rows are preserved but cannot sign in through the
  removed password endpoints. An email conflict is reported, not auto-linked.

Validation: `npm test` and `npm run build` in `backend`; `npm run build` in
`frontend`. Server tests use mock Google verification and queued database results,
never the configured database. They check API behavior and transaction commands,
not SQL execution or actual PostgreSQL rollback. A real Google login remains a
manual browser check.

**BACKEND**

Bygg frontend-projektet och återskapa dist-mappen samt starta webbtjänsten:
npm run build-frontend
npm run dev

---

USER API

---

**POST: Google Sign In**<br>
api/user/google<br>

Body: `{ "idToken": "<Google ID token>" }`.<br>
Returns `{ "requiresUsername": true }` for a new identity or
`{ "userName": "chosen_username" }` after saving a returning user's session.

<br><br>
**POST: Sign Out**<br>
api/user/signout<br>
<br>
**GET: Check Pending Signup**<br>
api/user/google/signup<br>
Requires an unexpired, Google-verified signup session.
<br><br>
**POST: Finish Google Signup**<br>
api/user/google/signup<br>

Body: `{ "username": "userexample" }`.<br>
Requires the pending signup cookie. Returns `{ "userName": "userexample" }`
after creating the account and saving its authenticated session.
<br><br>

**DELETE: Delete User**<br>
api/user/delete/<br>

Body: `{ "idToken": "<recent Google ID token for the signed-in account>" }`.<br>
Requires an authenticated application session.<br>
<br><br>

---

BOOKS API

---

-----_FOR ADMIN_-----<br><br>
**GET: Get all books and check with query if verified(Sign in not needed)**<br>
api/books/notverified<br>
<br>
**PATCH: Verify book and add to shelf(Sign in not needed)**<br>
api/books/verify/:bookid<br>
<br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>
-----_FOR USER_-----<br><br>
**GET: for the frontend Title Search Function**<br>
api/books/search?title=WORD<br>
<br>
=>Replace WORD with the word you want to search for<br>
<br>
**GET: Gets a users whole bookshelf. For mapping out a users bookshelf in frontend**<br>
api/books/bookshelf/<br>
<br>
<br>
**POST: Adds a new book to the Books table**<br>
api/books/addbook?genre=GENRE<br>
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
api/books/addtoshelf/:bookid<br>
<br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>
**POST: Adds a TAG to a book in the users bookshelf**<br>
api/books/addtag/:bookid<br>

=>Tag is sent in body. JSON Format:<br><br>
{"tag" : "Borrowing"}
<br><br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>

**DELETE: deleting a TAG from users bookshelf**<br>
api/books/removetag/:bookid<br>

=>Tag is sent in body. JSON Format:<br><br>
{"tag" : "Borrowing"}
<br><br>
=>Adressparameter(:bookid): Id from Books table.<br>
<br>

**DELETE: deleting a book from a users bookshelf**<br>
api/books/removefromshelf/:bookid<br>

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
