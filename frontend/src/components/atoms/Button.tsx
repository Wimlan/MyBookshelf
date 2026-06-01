function Button(props: { value: string; click: Function }) {
  return (
    <button
      className="font-bold py-2 px-4 rounded cursor-pointer bg-blue-500 text-white"
      onClick={() => props.click()}
    >
      {props.value}
    </button>
  );
}

export default Button;
