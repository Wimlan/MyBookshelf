import express from "express";
import type { QueryResult } from "pg";
import { database } from "./database.ts";
import { isAuthenticated } from "./middleware/isAuthenticated.ts";

const router = express.Router();

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre_id: number;
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

router.get("/", async (req, res) => {
  //Get all books from the books table and sets them into a function to that does inner join
  const books: QueryResult<Book> = await database.query("SELECT * FROM books");
  const detailedBooks = await getDetailedBook(books.rows);

  res.send(detailedBooks);
});

router.get("/bookshelf/:id", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);
  //Get all books inte users bookshelf(books id connected with the correct user id)
  const userBooks: QueryResult<Bookshelf> = await database.query(
    "SELECT * FROM bookshelves WHERE user_id = $1",
    [id],
  );

  //If no books in users shelf. Returns an empty array.
  if (userBooks.rows.length === 0) {
    res.send([]);
    return;
  }

  const books = await Promise.all(
    userBooks.rows.map(async (shelf) => {
      const result: QueryResult<Book> = await database.query(
        "SELECT * FROM books WHERE id = $1",
        [shelf.book_id],
      );
      return result.rows[0]!;
    }),
  );

  const detailedBooks = await getDetailedBook(books);

  res.send(detailedBooks);
});
export default router;
