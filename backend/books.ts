import express from "express";
import type { QueryResult } from "pg";
import { database } from "./database.ts";
import { isAuthenticated } from "./middleware/isAuthenticated.ts";
import { isAdmin } from "./middleware/isAdmin.ts";

const router = express.Router();

interface Book {
  id?: number;
  title: string;
  author: string;
  year: number;
  synopsis: string;
  genre_id?: number;
  image: string;
}

interface Genre {
  id: number;
  genre: string;
}

interface Bookshelf {
  id: number;
  user_id: number;
  book_id: number;
}

//Joins books with genres
async function getDetailedBook(books: Book[]) {
  //Goes through all books, matches genre_id with correct genre. Makes them into a genres object containing(id, genre) and joins to genre_id
  return Promise.all(
    books.map(async (book) => {
      const genres: QueryResult<Genre> = await database.query(
        `SELECT genres.*
        FROM genres INNER JOIN books
        ON books.genre_id = genres.id
      WHERE books.id = $1`,
        [book.id],
      );

      //makes an array with the book object and added to it, the genres object
      return { ...book, genres: genres.rows };
    }),
  );
}

//FOR ADMIN
//GET all books not verified
router.get("/notverified", isAdmin, async (req, res) => {
  const books: QueryResult<Book> = await database.query(
    "SELECT * FROM books WHERE verified = FALSE ORDER BY created_at",
  );
  const detailedBooks = await getDetailedBook(books.rows);
  res.send(detailedBooks);
});

//Used to verify book and add to shelf
router.patch("/verify/:bookid", isAdmin, async (req, res) => {
  const bookId = Number(req.params.bookid);

  const result: QueryResult<{ added_by: number }> = await database.query(
    "UPDATE Books SET verified = TRUE WHERE id = $1 RETURNING added_by",
    [bookId],
  );

  const userId = result.rows[0]!.added_by;

  //OBS!Kolla om kontot fortfarande finns!

  await database.query(
    "INSERT INTO Bookshelves(user_id, book_id) VALUES ($1, $2);",
    [userId, bookId],
  );

  res.send("Book verified and added to shelf.");
});

//----------------------------------------------------------

//FOR USER
//GET for the frontend Title Search Function
router.get("/search", async (req, res) => {
  const title = req.query.title;

  if (title) {
    //Get all books with matching title from the books table and sets them into a function to that does inner join
    const books: QueryResult<Book> = await database.query(
      "SELECT * FROM books WHERE title ILIKE $1 AND verified = TRUE LIMIT 5",
      [`%${title}%`],
    );
    const detailedBooks = await getDetailedBook(books.rows);
    res.send(detailedBooks);
  } else {
    res.send([]);
  }
});

//GET for mapping out a users bookshelf in frontend
router.get("/bookshelf", isAuthenticated, async (req, res) => {
  const userId = req.session.user;

  //Get all books in the users bookshelf(books id connected with the correct user id)
  const userBooks: QueryResult<Bookshelf> = await database.query(
    "SELECT * FROM Bookshelves WHERE user_id = $1",
    [userId],
  );

  //If no books in users shelf. Returns an empty array.
  if (userBooks.rows.length === 0) {
    res.send([]);
    return;
  }

  const books = await Promise.all(
    userBooks.rows.map(async (shelf) => {
      const result = await database.query("SELECT * FROM books WHERE id = $1", [
        shelf.book_id,
      ]);
      return result.rows[0]!;
    }),
  );

  const tags = await Promise.all(
    userBooks.rows.map(async (shelf) => {
      const result = await database.query(
        `SELECT tags.* FROM tags
          INNER JOIN BookShelves_Tags ON tags.id = BookShelves_Tags.tag_id
          WHERE BookShelves_Tags.bookshelf_id = $1`,
        [shelf.id],
      );
      return result.rows;
    }),
  );

  const detailedBooks = await getDetailedBook(books);

  const result = detailedBooks.map((book, i) => ({
    ...book,
    tags: tags[i],
  }));

  res.send(result);
});

//Adds a new book to the users bookshelf
router.post("/addtoshelf/:bookid", isAuthenticated, async (req, res) => {
  const userId = req.session.user;
  const bookId = Number(req.params.bookid);

  const userBookId: QueryResult<Bookshelf> = await database.query(
    "SELECT book_id FROM Bookshelves WHERE user_id = $1 AND book_id = $2",
    [userId, bookId],
  );

  if (userBookId.rows.length > 0) {
    res.status(409).json({ message: "Book already in shelf." });
    return;
  }

  try {
    await database.query(
      "INSERT INTO Bookshelves(user_id, book_id) VALUES ($1, $2);",
      [userId, bookId],
    );
    res.status(201).json({ message: "Book added to shelf." });
  } catch (error) {
    console.log(error);
    res.status(500).send("Book could not be added.");
  }
});

//deleting a book from a users bookshelf
router.delete("/removefromshelf/:bookid", isAuthenticated, async (req, res) => {
  const userId = req.session.user;
  const bookId = Number(req.params.bookid);

  try {
    const bookshelfId: QueryResult<Bookshelf> = await database.query(
      "SELECT id FROM Bookshelves WHERE user_id = $1 AND book_id = $2",
      [userId, bookId],
    );
    //Removes all tags from a specific book.
    //Promise.all makes sure that the delete is finished before the next query runs
    await Promise.all(
      bookshelfId.rows.map((bookshelf) => {
        database.query(
          "DELETE FROM Bookshelves_Tags WHERE bookshelf_id = $1;",
          [bookshelf.id],
        );
      }),
    );

    //Removes same book from bookshelf
    await database.query(
      "DELETE FROM Bookshelves WHERE user_id = $1 AND book_id = $2;",
      [userId, bookId],
    );
    res.status(200).json({ message: "Book removed from shelf." });
  } catch (error) {
    console.log(error);
    res.status(500).send("Book could not be removed.");
  }
});

//TAGS

//GET for getting all tags
router.get("/tags", async (req, res) => {
  //Get all tags
  const result: QueryResult<Bookshelf> =
    await database.query("SELECT * FROM Tags");

  const tags = result.rows;

  res.send(tags);
});

//Adds a TAG to a book in the users bookshelf
router.post("/addtag/:bookid", isAuthenticated, async (req, res) => {
  const userId = req.session.user;
  const bookId = Number(req.params.bookid);
  const tag = req.body.tag;

  const bookshelfId: QueryResult<Bookshelf> = await database.query(
    "SELECT id FROM Bookshelves WHERE user_id = $1 AND book_id = $2",
    [userId, bookId],
  );

  const tagId: QueryResult<{ id: number }> = await database.query(
    "SELECT id FROM Tags WHERE tag ILIKE $1",
    [tag],
  );

  if (bookshelfId.rows.length === 0) {
    res.status(409).send("No matching book found.");
    return;
  } else if (tagId.rows.length === 0) {
    res.status(409).send("No matching tag found.");
    return;
  }

  try {
    await database.query(
      "INSERT INTO Bookshelves_Tags(bookshelf_id, tag_id) VALUES ($1, $2);",
      [bookshelfId.rows[0]!.id, tagId.rows[0]!.id],
    );
    res.status(201).send("Tag added to book.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Tag could not be added.");
  }
});

//deleting a TAG from users bookshelf
router.delete("/removetag/:bookid", isAuthenticated, async (req, res) => {
  const userId = req.session.user;
  const bookId = Number(req.params.bookid);
  const tag = req.body.tag;

  const bookshelfId: QueryResult<Bookshelf> = await database.query(
    "SELECT id FROM Bookshelves WHERE user_id = $1 AND book_id = $2",
    [userId, bookId],
  );

  const tagId: QueryResult<{ id: number }> = await database.query(
    "SELECT id FROM Tags WHERE tag ILIKE $1",
    [tag],
  );

  if (bookshelfId.rows.length === 0) {
    res.status(409).send("No matching book found.");
    return;
  } else if (tagId.rows.length === 0) {
    res.status(409).send("No matching tag found.");
    return;
  }

  try {
    await database.query(
      "DELETE FROM Bookshelves_Tags WHERE bookshelf_id = $1 AND tag_id = $2;",
      [bookshelfId.rows[0]!.id, tagId.rows[0]!.id],
    );
    res.status(201).send("Tag removed from book.");
  } catch (error) {
    console.log(error);
    res.status(500).send("Tag could not be removed.");
  }
});

//BOOKS TABLE
//GET for getting all genres
router.get("/genres", async (req, res) => {
  //Get all tags
  const result: QueryResult<Bookshelf> = await database.query(
    "SELECT * FROM Genres",
  );

  const genres = result.rows;

  res.send(genres);
});

//Adds a new book to the books table
router.post("/addbook", isAuthenticated, async (req, res) => {
  const id = req.session.user;
  const newBook: Book = req.body;
  const genre = req.query.genre;
  const missing =
    !newBook ||
    newBook.title.length < 1 ||
    newBook.author.length < 1 ||
    newBook.year < 1 ||
    newBook.synopsis.length < 1 ||
    newBook.image.length < 1;

  if (!genre) {
    res
      .status(404)
      .json({ message: "Query parameter 'genre' is missing or wrong." });
    return;
  }
  const genreId: QueryResult<Pick<Genre, "id">> = await database.query(
    `SELECT id FROM Genres WHERE genre ILIKE $1`,
    [genre],
  );

  // add book from newBook(body) with genre
  if (missing) {
    res.status(404).json({ message: "Information missing" });
  } else {
    try {
      await database.query(
        "INSERT INTO Books(title, author, year, synopsis, genre_id, image, added_by) VALUES ($1, $2, $3, $4, $5, $6, $7);",
        [
          newBook!.title,
          newBook!.author,
          newBook!.year,
          newBook!.synopsis,
          genreId.rows[0]!.id,
          newBook!.image,
          id,
        ],
      );
      res.status(201).json({ message: "Book created." });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Book could not be added. It might already exist, but might not yet be verified. Try again in a couple of days.",
      });
    }
  }
});

export default router;
