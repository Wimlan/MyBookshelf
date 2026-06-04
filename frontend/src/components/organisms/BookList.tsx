import { useState, useEffect } from "react";

interface Props {
  user?: string;
}

function BookList({ user }: Props) {
  const [bookshelf, setBookshelf] = useState("");

  useEffect(() => {
    async function fetchBookshelf() {
      const res = await fetch(`http://localhost:3000/books/${user}`, {
        credentials: "include",
      });

      setBookshelf(await res.json());
    }
    fetchBookshelf();
  }, []);

  return <section>{bookshelf}</section>;
}

export default BookList;
