import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import MenuDropdown from "../atoms/MenuDropdown";
import Heading from "../atoms/Heading";
import SubHeading from "../atoms/SubHeading";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Label from "../atoms/Label";
import { Dialog, DialogPanel } from "@headlessui/react";

interface Props {
  user?: string;
}

function Header(props: Props) {
  const [signoutMessage, setSignoutMessage] = useState("");
  const [deleteMessage, setdeleteMessage] = useState("");
  const [userPass, setUserPass] = useState("");
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const errMessage = "Something went wrong. Please try again.";

  const links = [
    { click: () => handleSignout(), label: "Sign Out" },
    { click: () => setPopup(true), label: "Delete Account" },
  ];

  async function handleSignout() {
    try {
      const res = await fetch("http://localhost:3000/user/signout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        navigate("/");
      } else {
        setSignoutMessage(errMessage);
      }
    } catch (err) {
      setSignoutMessage(errMessage);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch("http://localhost:3000/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: userPass,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/");
      } else {
        setdeleteMessage(data.message);
      }
    } catch (err) {
      setdeleteMessage(errMessage);
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
      <section className="bg-warmgrey p-5 text-lg flex gap-10 justify-center align-center underline ">
        <Link className="hover:text-warmred" to={`/bookshelf/${props.user}`}>
          My Bookshelf
        </Link>
        <MenuDropdown button="My account" links={links} />
      </section>

      <Dialog
        open={popup}
        onClose={() => setPopup(false)}
        className="relative z-50 "
      >
        <div className=" fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-warmgrey p-12 text-darkest">
            <Heading text="Are you sure you want to delete this account?!" />
            <SubHeading text="A deleted account cannot be recovered." />
            <Label label="Your Password" />
            <Input
              value={userPass}
              type="password"
              placeholder="password"
              change={setUserPass}
              autoComplete="new-password"
            />
            <Button
              value="Delete Account"
              click={handleDelete}
              bg="bg-red-500"
            />{" "}
            <Button
              value="Cancel"
              click={() => setPopup(false)}
              bg="bg-gray-500"
            />
            {deleteMessage && <p className="text-red-500">{deleteMessage}</p>}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default Header;
