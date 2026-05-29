import { Link } from "react-router-dom";

function Signin() {
  return (
    <div id="sign-in">
      <input type="text" />
      <input type="password" />
      <button></button>
      <Link to="/createuser">Create New User</Link>{" "}
    </div>
  );
}

export default Signin;
