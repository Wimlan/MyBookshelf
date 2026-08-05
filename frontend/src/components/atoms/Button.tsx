interface Props {
  value: string;
  click?: () => void;
  bg?: string;
  type?: string;
}

// click={() => handleNav(`/`, navigate)}
export const handleNav = (adress: string, navigate: Function) => {
  navigate(adress);
};

function Button({ value, click, bg = "bg-mediumdarkgreen" }: Props) {
  return (
    <button
      className={`mb-3 mt-3 border border-lightest font-bold py-2 px-4 text-lightest rounded cursor-pointer ${bg} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
      onClick={click}
    >
      {value}
    </button>
  );
}

export default Button;
