import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Label from "../atoms/Label";
import Heading from "../atoms/Heading";

function Signin() {
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  //sends input user info to backend.
  //It then checks if the input values are correct.
  //If ok: returns username and navigates to route bookshelf/:userName
  //If error: Returns error message.
  async function handleSignin() {
    try {
      const res = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPass,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/bookshelf/${data.userName}`);
      } else {
        setLoginMessage(data.message);
      }
    } catch (err) {
      setLoginMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="sign-in"
      className="pt-3 pb-3 w-2/3 mx-auto text-center text-lightest lg:w-1/3 "
    >
      <Label label="Your Email" />
      <Input
        value={userEmail}
        type="text"
        change={setUserEmail}
        placeholder="name@example.com"
      />
      <Label label="Your Password" />
      <Input
        value={userPass}
        type="password"
        placeholder="password"
        change={setUserPass}
      />
      {/* Error message from fetch. Shows
      message only if message exists. */}
      {loginMessage && (
        <p className="text-red-500 bg-warmgrey w-fit mx-auto p-1">
          {loginMessage}
        </p>
      )}
      <Button value="Sign In" click={handleSignin} />

      <div className="mt-2 mb-2">
        <Heading text="No Account Yet?" />
        <Link
          to="/createuser"
          className="inline-flex items-center justify-center p-5 text-darkest font-bold border-4 border-solid border-mediumgreen rounded hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-base bg-warmgrey"
        >
          <span className="w-full">Create a New User</span>
          <svg
            className="w-6 h-6 ms-1 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 12H5m14 0-4 4m4-4-4-4"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default Signin;
