import { Link } from "react-router-dom";

interface Props {
  user?: string;
}

function MainTitle(props: Props) {
  const { user } = props;

  return (
    <h1 className="text-4xl md:text-5xl text-center text-lightest border-b-7 border-warmred pb-8 mt-15 mb-10 w-1/2 mx-auto">
      <Link to="/">{user ? `${user}'s Bookshelf` : "My Bookshelf"}</Link>
    </h1>
  );
}

export default MainTitle;
