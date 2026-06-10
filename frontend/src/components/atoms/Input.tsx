function Input(props: {
  value: string;
  change: Function;
  placeholder: string;
  type: string;
}) {
  return (
    <section className="mt-3 mb-3">
      <div className="relative">
        <input
          value={props.value}
          onChange={(e) => props.change(e.target.value)}
          type={props.type}
          id="input-group-1"
          className="bg-lightest border border-default-medium text-darkest text-sm rounded-base focus:ring-mediumgreen focus:border-mediumgreen block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder={props.placeholder}
        />
      </div>
    </section>
  );
}

export default Input;
