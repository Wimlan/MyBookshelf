function SecondaryHeader(props: { text: string }) {
  return <h3 className={`text-base md:text-lg  m-3`}>{props.text}</h3>;
}

export default SecondaryHeader;
