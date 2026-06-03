interface Props {
  value: string;
  click: () => void;
  bg?: string;
}

function Button({ value, click, bg = "bg-blue-500" }: Props) {
  return (
    <button
      className={`font-bold py-2 px-4 rounded cursor-pointer ${bg} text-white`}
      onClick={() => click()}
    >
      {value}
    </button>
  );
}

export default Button;
