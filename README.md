Homepage Link: https://mybookshelf-gd5p.onrender.com

## Google authentication setup

Use the same Google OAuth **Web application client ID** in both applications.
Google Identity Services handles Google sign-in; the backend uses
`google-auth-library` to verify the ID token's signature, issuer, audience and
expiry, and requires a verified email. Accounts are identified by Google's `sub`,
not by an email match. There is no automatic linking to password accounts.

### Local development

1. In `backend`, configure `.env` using `.env.example`: `PGURI`, a strong
   `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, and `APP_ORIGIN=http://localhost:5173`.
2. Run `npm install` in `backend`. For an existing `Users` table, manually apply
   `backend/migrations/001_google_auth_admin.sql` to your PostgreSQL database.
3. Run `npm run dev` in `backend` (port 3000).
4. Configure `frontend/.env.local` using `frontend/.env.example`, setting
   `VITE_GOOGLE_CLIENT_ID` to the same client ID. Run `npm install` and
   `npm run dev` in `frontend`.
5. Open exactly `http://localhost:5173` and authorize that origin in Google Cloud.
   Mutation requests require an `Origin` matching `APP_ORIGIN`; API clients must
   send that header too. Restart services after changing environment variables.

New accounts are not admins by default. After creating your account, grant it
admin access manually in your database.

Never use a client secret in the frontend. This flow needs only the public client
ID. Neither application logs or stores Google ID tokens.

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

### Checks

Run `npm test` and `npm run build` in `backend`, and `npm run build` in
`frontend`. Tests mock Google verification and database calls; verify SQL changes
and a real Google sign-in manually.

## Running the backend

From `backend`, build the frontend into `backend/dist` and start the server:

```sh
npm run build-frontend
npm run dev
```

## API

### User

| Method   | Path                      | Details                                                                                 |
| -------- | ------------------------- | --------------------------------------------------------------------------------------- |
| `POST`   | `/api/user/google`        | Body: `{ "idToken": "..." }`. Starts Google sign-in. A new user must choose a username. |
| `POST`   | `/api/user/google/signup` | Body: `{ "username": "..." }`. Completes a pending signup.                              |
| `GET`    | `/api/user/google/signup` | Checks for a valid pending signup session.                                              |
| `POST`   | `/api/user/signout`       | Ends the current session.                                                               |
| `DELETE` | `/api/user/delete`        | Requires a session and a recent Google ID token for the same account.                   |

### Books

| Method   | Path                                 | Access and details                                                  |
| -------- | ------------------------------------ | ------------------------------------------------------------------- |
| `GET`    | `/api/books/notverified`             | Admin access; lists unverified books.                               |
| `PATCH`  | `/api/books/verify/:bookid`          | Admin access; verifies a book and adds it to the submitter's shelf. |
| `GET`    | `/api/books/search?title=WORD`       | Searches verified books by title.                                   |
| `GET`    | `/api/books/bookshelf`               | Signed-in user's bookshelf.                                         |
| `POST`   | `/api/books/addbook?genre=GENRE`     | Signed-in user; book details go in the JSON body.                   |
| `POST`   | `/api/books/addtoshelf/:bookid`      | Adds a book to the signed-in user's shelf.                          |
| `POST`   | `/api/books/addtag/:bookid`          | Body: `{ "tag": "Borrowing" }`.                                     |
| `DELETE` | `/api/books/removetag/:bookid`       | Body: `{ "tag": "Borrowing" }`.                                     |
| `DELETE` | `/api/books/removefromshelf/:bookid` | Removes a book from the signed-in user's shelf.                     |

Example body for adding a book:

```json
{
  "title": "Book title",
  "author": "Author name",
  "year": 2024,
  "synopsis": "Short description",
  "image": "https://example.com/cover.jpg"
}
```

Genres: Literary Fiction, Mystery, Thriller, Science Fiction, Fantasy, Romance,
Horror, Historical Fiction, Adventure, Graphic Novel, Biography, Autobiography,
Memoir, Self-Help, History, True Crime, Science, Nature, Business, Finance,
Travel, Cooking, Religion, Spirituality, Politics, Philosophy, Health, Wellness,
Picture Books, Middle Grade, Young Adult, Fiction, Non-Fiction.

Tags: Read, To Read, Reading, Loaned, Borrowing, Abandoned, Re-Reading,
Re-Read, Favourite.
