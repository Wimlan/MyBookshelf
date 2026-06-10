function Label(props: { label: string }) {
  return (
    <section className="mt-3 mb-3">
      <label
        htmlFor="input-group-1"
        className="block mb-2.5 text-base text-lightest font-medium text-heading"
      >
        {props.label}
      </label>
    </section>
  );
}

export default Label;
