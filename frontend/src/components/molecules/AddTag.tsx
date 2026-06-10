import { useState, useEffect } from "react";
import type { SubmitEvent } from "react";
import type { Book, Tag } from "../../pages/Bookshelf";
import Button from "../atoms/Button";

interface Props {
  refresh: () => void;
  clickedbook: Book;
}

function BookCard({ refresh, clickedbook }: Props) {
  const [allTags, setAllTags] = useState<Tag[]>();
  const [booktags, setBookTags] = useState<Tag[]>(clickedbook.tags);
  const [tagsMessage, setTagsMessage] = useState("");

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`http://localhost:3000/books/tags/`);
        const data = await res.json();
        setAllTags(data);
        console.log(data);
      } catch (err) {
        console.log("Could not load tags.");
      }
    }
    fetchTags();
  }, []);

  useEffect(() => {
    setBookTags(clickedbook.tags);
  }, [clickedbook.tags]);

  async function addTag(e: SubmitEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const tagName = form.get("tag");
    console.log(tagName);

    try {
      const res = await fetch(
        `http://localhost:3000/books/addtag/${clickedbook.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tag: tagName,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        refresh();
      } else {
        setTagsMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      setTagsMessage("Something went wrong. Please try again.");
    }
  }

  async function removeTag(tag: string) {
    try {
      const res = await fetch(
        `http://localhost:3000/books/removetag/${clickedbook.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tag: tag,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        refresh();
      } else {
        setTagsMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <form className="max-w-sm mx-auto" onSubmit={addTag}>
        <label
          htmlFor="countries"
          className="block mb-2.5 text-sm font-medium text-heading"
        >
          Select a Tag{" "}
        </label>
        <select
          name="tag"
          id="tags"
          className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
        >
          {allTags?.map((tag) => (
            <option key={tag.id} value={tag.tag}>
              {tag.tag}
            </option>
          ))}
        </select>
        <button type="submit">Add Tag</button>
        {tagsMessage && <h1>{tagsMessage}</h1>}
      </form>
      <ul>
        {booktags.map((tag) => (
          <li key={tag.id} value={tag.tag}>
            {tag.tag}
            <Button value="Remove Tag" click={() => removeTag(tag.tag)} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default BookCard;
