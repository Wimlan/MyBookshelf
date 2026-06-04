import { Link } from "react-router-dom";

interface Props {
  user?: string;
}

function MainTitle(props: Props) {
  const { user } = props;

  return (
    <h1>
      <Link to="/">{user ? `${user}'s Bookshelf` : "My Bookshelf"}</Link>
    </h1>
  );
}

export default MainTitle;
