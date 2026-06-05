import { Dialog, DialogPanel } from "@headlessui/react";
import SubHeading from "../atoms/SubHeading";
import type { Book } from "../organisms/BookList";

interface Props {
  popup: boolean;
  close: () => void;
  book: Book;
}

function BookCard({ popup, close, book }: Props) {
  return (
    <>
      <Dialog open={popup} onClose={close} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <section>
              <div>
                <SubHeading text={book.title} />
                <p>{book.year}</p>
                <p>{book.author}</p>
                <p>{book.synopsis}</p>
              </div>
              <div>
                <img width="150" src={book.image} alt="" />
              </div>
            </section>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default BookCard;
