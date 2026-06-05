import { useState, useEffect } from "react";
import BookTag from "../molecules/BookTag";
import BookPopup from "../molecules/BookPopup";

export interface Book {
  id: number;
  title: string;
  year: number;
  author: string;
  synopsis: string;
  image: string;
  tags: Tags[];
}

interface Tags {
  id: number;
  tag: string;
}

function BookList() {
  const [bookshelf, setBookshelf] = useState<Book[]>([]);
  const [popup, setPopup] = useState(false);
  const [clickedBook, setClickedBook] = useState<Book>();

  useEffect(() => {
    fetchBookshelf();
  }, []);

  useEffect(() => {
    if (clickedBook) {
      const updated = bookshelf.find((b) => b.id === clickedBook.id);
      if (updated) setClickedBook(updated);
    }
  }, [bookshelf]);

  function handlePopup(book: Book) {
    setClickedBook(book);
    setPopup(true);
  }

  async function fetchBookshelf() {
    try {
      const res = await fetch(`http://localhost:3000/books/bookshelf/`, {
        credentials: "include",
      });
      const data = await res.json();
      setBookshelf(data);
      console.log(data);
    } catch (err) {
      console.log("Could not load bookshelf.");
    }
  }

  return (
    <>
      <section>
        {bookshelf &&
          bookshelf.map((book) => (
            <div key={book.id}>
              {book.tags.map((tag) => (
                <BookTag key={tag.id} tag={tag.tag} />
              ))}
              <li onClick={() => handlePopup(book)}>{book.title}</li>
            </div>
          ))}
      </section>
      <section>
        {clickedBook && (
          <BookPopup
            clickedbook={clickedBook}
            popup={popup}
            close={() => setPopup(false)}
            refresh={fetchBookshelf}
          />
        )}
      </section>
    </>
  );
}

export default BookList;
