interface Props {
  value: string;
  click: () => void;
  bg?: string;
}

export const handleNav = (adress: string, navigate: Function) => {
  navigate(adress);
};

function Button({ value, click, bg = "bg-mediumgreen" }: Props) {
  return (
    <button
      className={`mt-3 mb-3 border border-lightest font-bold py-2 px-4 text-lightest rounded cursor-pointer ${bg} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
      onClick={click}
    >
      {value}
    </button>
  );
}

export default Button;
