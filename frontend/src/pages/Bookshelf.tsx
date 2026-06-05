import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MainTitle from "../components/atoms/MainTitle";
import Header from "../components/organisms/Header";
import BookList from "../components/organisms/BookList";
import SearchAddBook from "../components/molecules/SearchAddBook";

export interface Book {
  id: number;
  title: string;
  year: number;
  author: string;
  synopsis: string;
  image: string;
  tags: Tags[];
}

export interface Tags {
  id: number;
  tag: string;
}

function Bookshelf() {
  const { userName } = useParams();
  const navigate = useNavigate();

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

  return (
    <>
      <MainTitle user={userName} />
      <Header user={userName} />
      <SearchAddBook />
      <BookList />
    </>
  );
}

export default Bookshelf;
