interface Props {
  title: string;
  click: () => void;
}

function BookCard({ title, click }: Props) {
  return (
    <li onClick={click}>
      <p>{title}</p>
    </li>
  );
}

export default BookCard;
