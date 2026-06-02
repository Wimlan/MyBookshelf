import Signin from "../components/Signin.tsx";
import MainTitle from "../components/atoms/MainTitle.tsx";
import SecondaryHeader from "../components/atoms/SecondaryHeader.tsx";

function Home() {
  return (
    <article id="home">
      <section id="intro">
        <MainTitle />
        <SecondaryHeader
          text="With this virtual bookshelf you can easily see the books you own, and
          keep track of their reading status. Add your real-life friends for
          loaning and borrowing, or maybe do a give-away of the books you don't
          need?"
        />
      </section>
      <Signin />
      <img src="#" alt="shelf screenshot" />
    </article>
  );
}

export default Home;
