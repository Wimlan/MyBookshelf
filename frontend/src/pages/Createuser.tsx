import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  //It then checks if the input values are correct.
  //If ok: returns username and navigates to route bookshelf/:userName
  //If error: Returns error message.
  async function handleCreation() {
    //checks that passwords match(TEST!!!)
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
      if (res.ok) {
        navigate(`/`);
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
      <Input label="Your Username" change={setUserName} placeholder="name" />
      <Input
        label="Your Email"
        change={setUserEmail}
        placeholder="name@example.com"
      />
      <Input
        label="Your Password"
        placeholder="password"
        change={setUserPass}
      />
      <Input
        label="Your Password"
        placeholder="password"
        change={setRepeatPass}
      />
      <a>Privacy Policy</a>
      <Button value="Create User" click={handleCreation} />
      {/* Error message from fetch. Shows message
      only if message exists. */}
      {message && <p>{message}</p>}{" "}
    </section>
  );
}

export default CreateUser;
