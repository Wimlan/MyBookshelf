import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MainTitle from "../components/atoms/MainTitle";
import Header from "../components/organisms/Header";

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
    </>
  );
}

export default Bookshelf;
