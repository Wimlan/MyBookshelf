import { useParams } from "react-router-dom";
import MainTitle from "../components/atoms/MainTitle";

function Bookshelf() {
  const { userName } = useParams();

  return <MainTitle user={userName} />;
}

export default Bookshelf;
