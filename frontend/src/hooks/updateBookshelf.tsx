import { useState, useCallback } from "react";
import type { Book } from "../pages/Bookshelf";

export function updateBookshelf() {
  const [bookshelf, setBookshelf] = useState<Book[]>([]);

  const fetchBookshelf = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/books/bookshelf/`, {
        credentials: "include",
      });
      const data = await res.json();
      setBookshelf(data);
    } catch (err) {
      console.log("Could not load bookshelf.");
    }
  }, []);

  return { bookshelf, fetchBookshelf };
}
