import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import SecondaryHeader from "../components/atoms/SecondaryHeader";

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
    <section id="sign-in">
      <SecondaryHeader text="Create New User" />
      <Input
        label="Your Username"
        type="text"
        change={setUserName}
        placeholder="name"
      />
      <Input
        label="Your Email"
        type="text"
        change={setUserEmail}
        placeholder="name@example.com"
      />
      <Input
        label="Your Password"
        type="password"
        placeholder="password"
        change={setUserPass}
      />
      <Input
        label="Your Password"
        type="password"
        placeholder="password"
        change={setRepeatPass}
      />
      <Link to="/privacypolicy">Privacy Policy</Link>
      <Button value="Create User" click={handleCreation} />
      {/* Error message from fetch. Shows message
      only if message exists. */}
      {message && <p>{message}</p>}{" "}
    </section>
  );
}

export default CreateUser;
