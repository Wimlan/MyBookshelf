import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Heading from "../atoms/Heading";
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
        <div className="fixed inset-0 flex w-screen items-center justify-center p-2">
          <DialogPanel className="overflow-y-auto max-h-screen xl:w-[60%] lg:[70%] w-[70%] space-y-4 border bg-warmgrey p-12">
            <section className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2">
                <Heading text={clickedbook.title} />
                <p className="italic">{clickedbook.year}</p>
                <p>{clickedbook.author}</p>
                <p className="bg-darkblue w-fit text-lightest p-1">
                  {clickedbook.genres[0].genre}
                </p>
                <p>{clickedbook.synopsis}</p>
              </div>
              <div className="shrink-0">
                <img
                  className="w-[200px] h-[300px] object-cover"
                  src={clickedbook.image}
                  alt=""
                />
              </div>
            </section>

            <section>
              <AddTag clickedbook={clickedbook} refresh={refresh} />
            </section>

            <section className="flex items-center justify-center">
              <Button
                value="Remove Book"
                bg="bg-warmred"
                click={() => setRemovePopup(true)}
              />
              <Dialog
                open={removePopup}
                onClose={() => setRemovePopup(false)}
                className="relative z-50"
              >
                {" "}
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                  <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                    <p>Are you sure you want to delete?</p>
                    <Button
                      bg="bg-warmred"
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
