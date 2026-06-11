function FirstHeader(props: { text: string }) {
  return <h2 className={`text-lg md:text-xl my-3`}>{props.text}</h2>;
}

export default FirstHeader;
