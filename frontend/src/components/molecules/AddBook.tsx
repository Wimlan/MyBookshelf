import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import SubHeading from "../atoms/SubHeading";
import Button from "../atoms/Button";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import type { Genre } from "../../pages/Bookshelf";

interface Props {
  popup: boolean;
  close: () => void;
}

function BookPopup({ popup, close }: Props) {
  const [allGenres, setAllGenres] = useState<Genre[]>();
  const [genre, setGenre] = useState("");
  const [message, setMessage] = useState("");
  const [addedPopup, setaddedPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [image, setImage] = useState("");
  const maxInput = 500;

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`/api/books/genres/`);
        const data = await res.json();
        setAllGenres(data);
        setGenre(data[0]?.genre ?? "");
      } catch (err) {
        console.log("Could not load genres.");
      }
    }
    fetchTags();
  }, []);

  async function addBook() {
    try {
      const res = await fetch(`/api/books/addbook?genre=${genre}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          year,
          synopsis,
          image,
        }),
        credentials: "include",
      });

      if (res.ok) {
        setaddedPopup(true);
        setTitle("");
        setAuthor("");
        setGenre("");
        setYear("");
        setSynopsis("");
        setImage("");
      } else {
        setMessage("Information in form is missing.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Dialog open={popup} onClose={close} className="relative z-50 ">
        <div className=" fixed inset-0 flex w-screen items-center justify-center p-2">
          <DialogPanel className="overflow-y-auto max-h-screen md:w-1/2 w-[90%] space-y-4 border bg-warmgrey p-12">
            <section>
              <SubHeading text="Create New Book" />
              <Label label="Title" />
              <Input
                value={title}
                change={setTitle}
                placeholder="title"
                type="text"
              />

              <Label label="Author" />
              <Input
                value={author}
                change={setAuthor}
                placeholder="author"
                type="text"
              />

              <Label label="Genre" />
              <select
                name="genre"
                id="genres"
                className="block w-full px-3 py-2.5 bg-lightest border border-default-medium text-heading text-sm rounded-base focus:ring-mediumgreen focus:border-mediumgreen shadow-xs placeholder:text-body"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {allGenres?.map((genre) => (
                  <option key={genre.id} value={genre.genre}>
                    {genre.genre}
                  </option>
                ))}
              </select>

              <Label label="Year of Release" />
              <Input
                value={year}
                change={setYear}
                placeholder="year"
                type="text"
              />

              <Label label="Synopsis" />
              <textarea
                className="bg-lightest border border-default-medium text-heading text-sm rounded-base focus:ring-mediumgreen focus:border-mediumgreen block w-full px-3 py-2.5 shadow-xs"
                value={synopsis}
                maxLength={maxInput}
                onChange={(e) => setSynopsis(e.target.value)}
              />
              <span>
                {synopsis.length} / {maxInput}
              </span>

              <Label label="Image Link" />
              <Input
                value={image}
                change={setImage}
                placeholder="image link"
                type="text"
              />
            </section>

            <Button value="Create Book" click={addBook} />
            <Button value="Cancel" click={() => close()} bg="bg-gray-500" />
            {message && <h1 className="text-red-500">{message}</h1>}

            <Dialog open={addedPopup} onClose={close} className="relative z-50">
              {" "}
              <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                  <p>
                    The book you created will be verified by the team and then
                    added to your bookshelf.
                  </p>
                  <Button
                    click={() => {
                      setaddedPopup(false);
                      setMessage("");
                    }}
                    value="I understand"
                  />
                </DialogPanel>
              </div>
            </Dialog>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default BookPopup;
