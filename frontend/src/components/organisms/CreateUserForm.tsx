import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "../atoms/Heading";
import { readAuthResponse } from "../../auth";

function CreateUserForm() {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestInProgress = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function checkSignup() {
      try {
        const res = await fetch("/api/user/google/signup", {
          credentials: "include",
        });
        if (res.status === 401) {
          if (active) navigate("/", { replace: true });
          return;
        }
        const data = await readAuthResponse(res);
        if (!data.requiresUsername)
          throw new Error("Sign in with Google again to choose a username.");
        if (active) setIsReady(true);
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to check signup. Please try again.",
          );
        }
      }
    }
    void checkSignup();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleCreation() {
    if (requestInProgress.current) return;
    const isValidUsername = /^[A-Za-z0-9_-]{3,30}$/.test(userName);
    if (!isValidUsername) {
      setMessage("Use 3-30 letters, numbers, underscores, or hyphens.");
      return;
    }
    requestInProgress.current = true;
    setIsSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/google/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: userName }),
      });
      const data = await readAuthResponse(res);
      if (!data.userName?.trim())
        throw new Error("The server returned an invalid username.");
      navigate(`/bookshelf/${encodeURIComponent(data.userName)}`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      requestInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Heading text="Choose your username" />
      <p>
        Your Google account is verified. Choose a unique username to finish
        creating your bookshelf.
      </p>
      {isReady && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleCreation();
          }}
        >
          <label htmlFor="signup-username" className="block mt-3">
            Your Username
          </label>
          <input
            id="signup-username"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            autoComplete="username"
            minLength={3}
            maxLength={30}
            pattern={"[A-Za-z0-9_\\-]{3,30}"}
            required
            disabled={isSubmitting}
            className="bg-lightest text-darkest rounded px-3 py-2.5 my-3"
          />
          <p>
            3-30 letters, numbers, underscores, or hyphens. Usernames are
            case-sensitive.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="my-3 border border-lightest font-bold py-2 px-4 rounded bg-mediumdarkgreen disabled:opacity-50"
          >
            {isSubmitting ? "Creating your account..." : "Create Account"}
          </button>
        </form>
      )}
      {message && <p role="alert">{message}</p>}
    </>
  );
}

export default CreateUserForm;
