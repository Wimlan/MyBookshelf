import { useRef, useState } from "react";
import type { CredentialResponse } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import Heading from "../atoms/Heading";
import GoogleIdentityButton from "../molecules/GoogleIdentityButton";
import { readAuthResponse } from "../../auth";

function Signin() {
  const [loginMessage, setLoginMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const requestInProgress = useRef(false);
  const navigate = useNavigate();

  async function handleSignin({ credential: idToken }: CredentialResponse) {
    if (requestInProgress.current) return;

    setLoginMessage("");
    if (!idToken) {
      setLoginMessage("Google did not return an ID token. Please try again.");
      return;
    }

    requestInProgress.current = true;
    setIsSigningIn(true);

    try {
      const res = await fetch("/api/user/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });

      const data = await readAuthResponse(res);
      if (data.requiresUsername) {
        navigate("/createuser");
        return;
      }
      const userName = data.userName;
      const isInvalidResponse =
        typeof userName !== "string" || !userName.trim();

      if (isInvalidResponse) {
        throw new Error("The server returned an invalid sign-in response.");
      }

      navigate(`/bookshelf/${encodeURIComponent(userName)}`);
    } catch (error) {
      setLoginMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in with Google. Please try again.",
      );
    } finally {
      requestInProgress.current = false;
      setIsSigningIn(false);
    }
  }

  return (
    <section
      id="sign-in"
      className="pt-3 pb-3 w-2/3 mx-auto text-center text-lightest lg:w-1/3"
      aria-busy={isSigningIn}
    >
      <Heading text="Sign in with Google" />
      <p className="mb-3">Use your Google account to continue.</p>
      <GoogleIdentityButton
        onSuccess={handleSignin}
        onError={setLoginMessage}
        busy={isSigningIn}
      />
      {isSigningIn && <p role="status">Signing you in...</p>}
      {loginMessage && (
        <p role="alert" className="text-red-500 bg-warmgrey w-fit mx-auto p-1">
          {loginMessage}
        </p>
      )}
      <p className="mt-3">
        <Link to="/privacypolicy" className="underline hover:text-purple-500">
          Privacy Policy
        </Link>
      </p>
    </section>
  );
}

export default Signin;
