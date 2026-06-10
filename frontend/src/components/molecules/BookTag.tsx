import { useState, useEffect } from "react";

interface Props {
  tag: string;
}

function BookCard({ tag }: Props) {
  const [bg, setBg] = useState("bg-blue-500");

  useEffect(() => {
    switch (tag) {
      case "Read":
      case "Re-Read":
        setBg("bg-green-500");
        break;
      case "To Read":
        setBg("bg-blue-500");
        break;
      case "Reading":
      case "Re-Reading":
        setBg("bg-orange-500");
        break;
      case "Abandoned":
        setBg("bg-red-500");
        break;
      case "Favourite":
        setBg("bg-yellow-500");
        break;
      case "Borrowing":
        setBg("bg-purple-500");
        break;
      case "Loaned":
        setBg("bg-grey-500");
        break;
    }
  }, []);

  return <p className={`${bg}`}>{tag}</p>;
}

export default BookCard;
