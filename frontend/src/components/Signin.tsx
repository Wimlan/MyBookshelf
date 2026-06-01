import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./atoms/Button";
import Input from "./atoms/Input";

function Signin() {
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

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
      <Button value="Sign In" click={handleSignin} />
      {loginMessage && <p>{loginMessage}</p>}

      <p>No account yet?</p>
      <Link to="/createuser">Create New User</Link>
    </section>
  );
}

export default Signin;
