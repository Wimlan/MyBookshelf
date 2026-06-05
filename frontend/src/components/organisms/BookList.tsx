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
    fetchBookshelf();
  }, []);

  function handlePopup(book: Book) {
    setClickedBook(book);
    setPopup(true);
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
            popup={popup}
            close={() => setPopup(false)}
            book={clickedBook}
          />
        )}
      </section>
    </>
  );
}

export default BookList;
