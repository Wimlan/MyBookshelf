import { Link } from "react-router-dom";
import MainTitle from "../components/atoms/MainTitle";
import CreateUserForm from "../components/organisms/CreateUserForm";

function CreateUser() {
  return (
    <>
      <MainTitle />
      <section
        id="create-user"
        className="w-3/4 md:w-2/3 mx-auto text-center text-lightest lg:w-1/2"
      >
        <CreateUserForm />
        <p className="my-3">
          <Link to="/privacypolicy" className="underline">
            Privacy Policy
          </Link>
        </p>
        <p className="mb-5">
          <Link to="/" className="underline">
            Back to Google sign-in
          </Link>
        </p>
      </section>
    </>
  );
}

export default CreateUser;
