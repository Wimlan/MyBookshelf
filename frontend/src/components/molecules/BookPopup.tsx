import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import SubHeading from "../atoms/SubHeading";

interface Props {
  title: string;
  click: () => void;
  dialog: boolean;
}

function BookCard({ title, click, dialog }: Props) {
  const [popup, setPopup] = useState(false);

  return (
    <>
      <Dialog
        open={popup}
        onClose={() => setPopup(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <SubHeading text={title} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default BookCard;
