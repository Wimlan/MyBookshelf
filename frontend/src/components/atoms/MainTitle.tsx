interface Props {
  user?: string;
}

function MainTitle(props: Props) {
  const { user } = props;

  return <h1>{user ? `${user}'s Bookshelf` : "My Bookshelf"}</h1>;
}

export default MainTitle;
