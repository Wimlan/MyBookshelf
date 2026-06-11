import { useState, useEffect } from "react";

interface Props {
  tag: string;
}

function BookCard({ tag }: Props) {
  const [bg, setBg] = useState("bg-blue");

  useEffect(() => {
    switch (tag) {
      case "Read":
      case "Re-Read":
        setBg("bg-green");
        break;
      case "To Read":
        setBg("bg-pink");
        break;
      case "Reading":
      case "Re-Reading":
        setBg("bg-blue");
        break;
      case "Abandoned":
        setBg("bg-grey");
        break;
      case "Favourite":
        setBg("bg-yellow");
        break;
      case "Loaned":
      case "Borrowing":
        setBg("bg-purple");
        break;
    }
  }, []);

  return (
    <p className={`${bg} w-[150px] h-[30px] p-1 text-center text-lightest`}>
      {tag}
    </p>
  );
}

export default BookCard;
