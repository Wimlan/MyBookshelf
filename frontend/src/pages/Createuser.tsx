import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainTitle from "../components/atoms/MainTitle";
import Button, { handleNav } from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Heading from "../components/atoms/Heading";
import Label from "../components/atoms/Label";

function CreateUser() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //sends input user info to backend.
  //Backend then checks if the input values are correct.
  //If ok: Navigates to route Home
  //If error: Returns error message.
  async function handleCreation() {
    //checks that passwords match
    if (userPass !== repeatPass) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: userEmail,
          password: userPass,
        }),
      });

      const data = await res.json();
      if (res.status === 201) {
        navigate("/");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="create-user"
      className="w-3/4 md:w-2/3 mx-auto text-center text-lightest lg:w-1/2 "
    >
      <MainTitle />
      <Heading text="Create New User" />
      <div className=" mx-auto xl:w-90 ">
        <Label label="Your Username" />
        <Input
          value={userName}
          type="text"
          change={setUserName}
          placeholder="name"
        />
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
        <Label label="Your Password" />
        <Input
          value={repeatPass}
          type="password"
          placeholder="password"
          change={setRepeatPass}
        />
      </div>
      <div className="flex flex-col w-3xs mx-auto mb-3">
        <Link
          className="underline hover:text-purple-500 text-lg"
          to="/privacypolicy"
        >
          Privacy Policy
        </Link>
        <Button value="Create User" click={handleCreation} />
        {/* Error message from fetch. Shows message
      only if message exists. */}
        {message && <p>{message}</p>}{" "}
      </div>
      <div className="mb-5">
        {" "}
        <Button
          bg="bg-warmred"
          value="Go Back"
          click={() => handleNav(`/`, navigate)}
        />
      </div>
    </section>
  );
}

export default CreateUser;
