import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import SubHeading from "../atoms/SubHeading";
import type { Book } from "../../pages/Bookshelf";
import AddTag from "./AddTag";
import Button from "../atoms/Button";

interface Props {
  popup: boolean;
  close: () => void;
  clickedbook: Book;
  refresh: () => void;
}

function BookPopup({ popup, close, clickedbook, refresh }: Props) {
  const [message, setMessage] = useState("");
  const [removePopup, setRemovePopup] = useState(false);

  async function removeFromShelf() {
    try {
      const res = await fetch(
        `http://localhost:3000/books/removefromshelf/${clickedbook.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await res.json();

      if (res.ok) {
        refresh();
        close();
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Dialog open={popup} onClose={close} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <section>
              <div>
                <SubHeading text={clickedbook.title} />
                <p>{clickedbook.year}</p>
                <p>{clickedbook.author}</p>
                <p>{clickedbook.synopsis}</p>
              </div>
              <div>
                <img width="150" src={clickedbook.image} alt="" />
              </div>
            </section>

            <section>
              <AddTag clickedbook={clickedbook} refresh={refresh} />
            </section>

            <section>
              <a onClick={() => setRemovePopup(true)}>Remove Book from Shelf</a>
              <Dialog
                open={removePopup}
                onClose={close}
                className="relative z-50"
              >
                {" "}
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                  <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    <p>Are you sure you want to delete?</p>
                    <Button
                      click={() => removeFromShelf()}
                      value="Remove Book"
                    />{" "}
                    <Button
                      click={() => setRemovePopup(false)}
                      value="Cancel"
                    />
                  </DialogPanel>
                </div>
              </Dialog>
            </section>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default BookPopup;
