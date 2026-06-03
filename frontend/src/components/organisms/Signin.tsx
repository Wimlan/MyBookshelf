import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Label from "../atoms/Label";

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
      const res = await fetch("http://localhost:3000/user/signin", {
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
    <section id="sign-in">
      <Label label="Your Email" />
      <Input type="text" change={setUserEmail} placeholder="name@example.com" />
      <Label label="Your Password" />
      <Input type="password" placeholder="password" change={setUserPass} />
      <Button value="Sign In" click={handleSignin} />
      {/* Error message from fetch. Shows
      message only if message exists. */}
      {loginMessage && <p>{loginMessage}</p>}
      <p>No account yet?</p>
      <Link to="/createuser">Create New User</Link>
    </section>
  );
}

export default Signin;
