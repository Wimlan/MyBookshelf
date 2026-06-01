import Signin from "../components/Signin.tsx";

function Home() {
  return (
    <article id="home">
      <section id="intro">
        <h1>My Bookshelf</h1>
        <h2>
          With this virtual bookshelf you can easily see the books you own, and
          keep track of their reading status. Add your real-life friends for
          loaning and borrowing, or maybe do a give-away of the books you don't
          need?
        </h2>
      </section>
      <Signin />
      <img src="#" alt="shelf screenshot" />
    </article>
  );
}

export default Home;
