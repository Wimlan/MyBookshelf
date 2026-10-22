import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { readAuthResponse } from "../auth";
import Signin from "../components/organisms/Signin.tsx";
import MainTitle from "../components/atoms/MainTitle.tsx";
import Heading from "../components/atoms/Heading.tsx";
import BookshelfImg from "../assets/bookshelfex.png";

function Home() {
  const navigate = useNavigate();
  const [sessionMessage, setSessionMessage] = useState("");

  //Checks if user is logged in in backend, and if ok navigates to bookshelf
  //This way the user won't have to log in twice
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/user/session", {
          credentials: "include",
        });
        if (res.status === 401) return;
        const data = await readAuthResponse(res);
        if (!data.userName?.trim())
          throw new Error("The server returned an invalid session.");
        navigate(`/bookshelf/${encodeURIComponent(data.userName)}`);
      } catch (error) {
        setSessionMessage(
          error instanceof Error
            ? error.message
            : "Unable to check your session.",
        );
      }
    }
    checkSession();
  }, [navigate]);
  return (
    <article id="home">
      <MainTitle />
      <section
        id="intro"
        className="w-[90%] mx-auto text-center text-lightest lg:w-1/2"
      >
        <Heading
          text="With this virtual bookshelf you can easily see the books you own, and
          keep track of their reading status."
        />
        <Heading
          text=" Add your real-life friends for
          loaning and borrowing, or maybe do a give-away of the books you don't
          need?"
        />
      </section>
      <Signin />
      {sessionMessage && (
        <p role="alert" className="text-lightest text-center">
          {sessionMessage}
        </p>
      )}
      <img
        className="mx-auto"
        src={BookshelfImg}
        width="900"
        alt="shelf screenshot"
      />
    </article>
  );
}

export default Home;
