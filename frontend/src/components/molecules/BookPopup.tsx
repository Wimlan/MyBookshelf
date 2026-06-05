import { Dialog, DialogPanel } from "@headlessui/react";
import SubHeading from "../atoms/SubHeading";
import type { Book } from "../../pages/Bookshelf";
import AddTag from "./AddTag";

interface Props {
  popup: boolean;
  close: () => void;
  clickedbook: Book;
  refresh: () => void;
}

function BookCard({ popup, close, clickedbook, refresh }: Props) {
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
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default BookCard;
