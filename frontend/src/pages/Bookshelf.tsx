import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainTitle from "../components/atoms/MainTitle";
import Header from "../components/organisms/Header";
import BookList from "../components/organisms/BookList";
import SearchAddBook from "../components/molecules/SearchAddBook";
import AddBook from "../components/molecules/AddBook";
import SubHeading from "../components/atoms/SubHeading";
import Button from "../components/atoms/Button";

export interface Book {
  id: number;
  title: string;
  year: number;
  author: string;
  synopsis: string;
  image: string;
  tags: Tag[];
  genres: Genre[];
}

export interface Tag {
  id: number;
  tag: string;
}

export interface Genre {
  id: number;
  genre: string;
}

function Bookshelf() {
  const [bookshelf, setBookshelf] = useState<Book[]>([]);
  const { userName } = useParams();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);

  //Checks if user is logged in in backend, and if not navigates to home
  //This way an unauthorized user cant access someone else's page
  useEffect(() => {
    async function checkSession() {
      const res = await fetch("http://localhost:3000/user/session", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        navigate("/");
        return;
      }

      if (data.userName !== userName) {
        navigate(`/bookshelf/${data.userName}`);
        console.log("url user:", userName);
      }
    }
    checkSession();
  }, [userName]);

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
      <MainTitle user={userName} />

      <Header user={userName} />
      <SearchAddBook refresh={fetchBookshelf} />
      <AddBook popup={popup} close={() => setPopup(false)} />
      <SubHeading text="Can't find your book?" />
      <Button value="Create a New Book" click={() => setPopup(true)} />
      <BookList bookshelf={bookshelf} fetchBookshelf={fetchBookshelf} />
    </>
  );
}

export default Bookshelf;
