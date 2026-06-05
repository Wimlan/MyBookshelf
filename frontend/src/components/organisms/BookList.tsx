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

interface Props {
  bookshelf: Book[];
  fetchBookshelf: () => void;
}

function BookList({ bookshelf, fetchBookshelf }: Props) {
  const [popup, setPopup] = useState(false);
  const [clickedBook, setClickedBook] = useState<Book>();

  useEffect(() => {
    fetchBookshelf();
  }, []);

  function handlePopup(book: Book) {
    setClickedBook(book);
    setPopup(true);
  }

  useEffect(() => {
    fetchBookshelf();
  }, []);

  useEffect(() => {
    if (clickedBook) {
      const updated = bookshelf.find((b) => b.id === clickedBook.id);
      if (updated) setClickedBook(updated);
    }
  }, [bookshelf]);

  return (
    <>
      <section>
        {bookshelf &&
          //With [...bookshelf] the variable itself doesn't mutate and keeps it original state when used elsewhere
          [...bookshelf].reverse().map((book) => (
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
