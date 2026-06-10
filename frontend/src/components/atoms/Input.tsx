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
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder={props.placeholder}
        />
      </div>
    </section>
  );
}

export default Input;
