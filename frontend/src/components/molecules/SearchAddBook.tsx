import { useState, useEffect, use } from "react";
import SearchInput from "../atoms/SearchInput";
import SubHeading from "../atoms/SubHeading";
import Button from "../atoms/Button";
import type { Book } from "../../pages/Bookshelf";
import { updateBookshelf } from "../../hooks/updateBookshelf";

function SearchAddBook() {
  const [searchText, setSearchText] = useState("");
  const [searchRes, setSearchRes] = useState<Book[]>([]);
  const [clickedBook, setClickedBook] = useState<Book>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function handleSearch() {
      const res = await fetch(
        `http://localhost:3000/books/search?title=${searchText}`,
      );
      const data = await res.json();
      setSearchRes(data);
    }
    handleSearch();
  }, [searchText]);

  async function addBookshelf() {
    try {
      const res = await fetch(
        `http://localhost:3000/books/addtoshelf/${clickedBook?.id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Book could not be added. Please try again.");
    }
  }

  return (
    <section className="mt-3 mb-3">
      <SubHeading text="Search for Book Title" />
      <div>
        {message && <p>{message}</p>}
        <SearchInput change={setSearchText} />
        <ul>
          {" "}
          {searchRes.map((res) => (
            <li onClick={() => setClickedBook(res)}>{res.title}</li>
          ))}
        </ul>
      </div>
      {clickedBook && (
        <div>
          <p>{clickedBook.title}</p>
          <Button value="Add to Bookshelf" click={() => addBookshelf()} />
        </div>
      )}
    </section>
  );
}

export default SearchAddBook;
