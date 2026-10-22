import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { CredentialResponse } from "@react-oauth/google";

import MenuDropdown from "../atoms/MenuDropdown";
import Heading from "../atoms/Heading";
import SubHeading from "../atoms/SubHeading";
import Button from "../atoms/Button";
import GoogleIdentityButton from "../molecules/GoogleIdentityButton";
import { readAuthResponse } from "../../auth";
import { Dialog, DialogPanel } from "@headlessui/react";

interface Props {
  user?: string;
}

function Header(props: Props) {
  const [signoutMessage, setSignoutMessage] = useState("");
  const [deleteMessage, setdeleteMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const requestInProgress = useRef(false);
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const errMessage = "Something went wrong. Please try again.";

  const links = [
    { click: () => handleSignout(), label: "Sign Out" },
    { click: () => setPopup(true), label: "Delete Account" },
  ];

  async function handleSignout() {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      });

      await readAuthResponse(res);
      navigate("/");
    } catch (err) {
      setSignoutMessage(err instanceof Error ? err.message : errMessage);
    }
  }

  async function handleDelete({ credential: idToken }: CredentialResponse) {
    if (requestInProgress.current) return;
    if (!idToken) {
      setdeleteMessage("Google did not return an ID token. Please try again.");
      return;
    }
    requestInProgress.current = true;
    setIsDeleting(true);
    setdeleteMessage("");
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
        }),
        credentials: "include",
      });

      await readAuthResponse(res);
      navigate("/");
    } catch (err) {
      setdeleteMessage(err instanceof Error ? err.message : errMessage);
    } finally {
      requestInProgress.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div>
        {" "}
        {/* Error message from fetch. Shows
      message only if message exists. */}
        {signoutMessage && <p>{signoutMessage}</p>}
      </div>
      <section className="bg-warmgrey  p-5 text-lg flex gap-10 justify-center align-center underline ">
        <Link className="hover:text-warmred" to={`/bookshelf/${props.user}`}>
          My Bookshelf
        </Link>
        <MenuDropdown button="My Account" links={links} />
      </section>

      <Dialog
        open={popup}
        onClose={() => {
          if (!isDeleting) setPopup(false);
        }}
        className="relative z-50 "
      >
        <div className=" fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-warmgrey p-12 text-darkest">
            <Heading text="Are you sure you want to delete this account?!" />
            <SubHeading text="A deleted account cannot be recovered." />
            <p>
              Confirm with the same Google account to permanently delete your
              bookshelf.
            </p>
            <GoogleIdentityButton
              onSuccess={handleDelete}
              onError={setdeleteMessage}
              busy={isDeleting}
            />
            {isDeleting && <p role="status">Deleting your account...</p>}
            <Button
              value="Cancel"
              click={() => {
                if (!isDeleting) setPopup(false);
              }}
              bg="bg-gray-500"
            />
            {deleteMessage && (
              <p role="alert" className="text-red-500">
                {deleteMessage}
              </p>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default Header;
