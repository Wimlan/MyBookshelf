import { useState, useEffect } from "react";
import SearchInput from "../atoms/SearchInput";
import SubHeading from "../atoms/SubHeading";
import Button from "../atoms/Button";
import type { Book } from "../../pages/Bookshelf";

interface Props {
  refresh: () => void;
}

function SearchAddBook({ refresh }: Props) {
  const [searchText, setSearchText] = useState("");
  const [searchRes, setSearchRes] = useState<Book[]>([]);
  const [clickedBook, setClickedBook] = useState<Book>();
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function handleSearch() {
      const res = await fetch(`/api/books/search?title=${searchText}`);
      const data = await res.json();
      setSearchRes(data);
    }
    handleSearch();
  }, [searchText]);

  async function addBookshelf() {
    try {
      const res = await fetch(`/api/books/addtoshelf/${clickedBook?.id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setClickedBook(undefined);
        refresh();
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Book could not be added. Please try again.");
    }
  }

  return (
    <>
      <section className="pt-1 pb-5 text-center bg-darkblue">
        <div className="text-lightest">
          <SubHeading text="Search for Book Title" />
        </div>
        <div className="relative w-80 mx-auto">
          <SearchInput value={searchText} change={setSearchText} />
          <ul className="absolute mt-0 w-full text-darkest text-left bg-warmgrey ">
            {" "}
            {searchRes.map((res) => (
              <li
                className=" cursor-pointer hover:bg-mediumgreen hover:text-lightest"
                onClick={() => {
                  setClickedBook(res);
                  setSearchText("");
                  setMessage("");
                }}
              >
                {res.title}
              </li>
            ))}
          </ul>
        </div>{" "}
        {clickedBook && (
          <div className="text-lightest mt-5">
            <p>{clickedBook.title}</p>
            <Button value="Add to Bookshelf" click={() => addBookshelf()} />
            {message && <p className=" text-lightest italic">{message}</p>}
          </div>
        )}
      </section>
    </>
  );
}

export default SearchAddBook;
