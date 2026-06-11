import { useState, useEffect } from "react";
import BookTag from "../molecules/BookTag";
import BookPopup from "../molecules/BookPopup";
import type { Book } from "../../pages/Bookshelf";

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
    if (clickedBook) {
      const updated = bookshelf.find((b) => b.id === clickedBook.id);
      if (updated) setClickedBook(updated);
    }
  }, [bookshelf]);

  return (
    <>
      <section className="my-10 w-3/4 mx-auto">
        <ul className="grid frid-cols-2 md:grid-cols-4 gap-y-4">
          {bookshelf &&
            //With [...bookshelf] the variable itself doesn't mutate and keeps it original state when used elsewhere
            [...bookshelf].reverse().map((book) => (
              <li
                key={book.id}
                className="flex flex-col gap-2 border-b-30 border-warmred"
              >
                <div className="flex flex-col flex-wrap mb-1 flex-1 w-1/2 mx-auto gap-1 justify-end">
                  {book.tags.map((tag) => (
                    <BookTag key={tag.id} tag={tag.tag} />
                  ))}
                </div>
                <div
                  className="bg-mediumgreen w-50 h-70 mx-auto flex items-center justify-center "
                  onClick={() => handlePopup(book)}
                >
                  <p className="text-3xl text-center text-lightest">
                    {book.title}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </section>
      <section>
        {clickedBook && (
          <BookPopup
            clickedbook={clickedBook}
            popup={popup}
            close={() => {
              setPopup(false);
              setClickedBook(undefined);
            }}
            refresh={fetchBookshelf}
          />
        )}
      </section>
    </>
  );
}

export default BookList;
