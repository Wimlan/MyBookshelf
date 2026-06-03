import Heading from "../components/atoms/Heading";
import SubHeading from "../components/atoms/SubHeading";

function PrivacyPolicy() {
  return (
    <article id="privacy-policy">
      <Heading text="Privacy Policy – My Bookshelf" />
      <p>Last updated: June 2026</p>
      <p>
        <span>My Bookshelf</span> is a personal project created and operated by
        an individual based in Gothenburg, Sweden. It is not affiliated with any
        company or organization.
      </p>

      <section id="data">
        <SubHeading text="What data we collect" />
        <p>What data we collect</p>
        <ol>
          <li>
            Your <span>username</span>
          </li>
          <li>
            Your <span>email address</span>
          </li>
          <li>
            Your <span>password</span> (hashed using Argon2 — we never store
            your password in plain text)
          </li>
        </ol>

        <p>When you use the app, we also store:</p>
        <ol>
          <li>
            The <span>books</span> you add to your virtual bookshelf
          </li>
        </ol>
      </section>

      <section id="why-collect">
        <SubHeading text="Why we collect it" />
        <p>
          We collect this data solely to provide the service — creating your
          account, letting you log in, and saving your bookshelf.
        </p>
      </section>

      <section id="who-share">
        <SubHeading text="Who we share it with" />
        <p>
          We do not share your data with anyone. No third parties, no
          advertisers, no analytics services.
        </p>
      </section>

      <section id="how-long">
        <SubHeading text="How long we keep it" />
        <p>
          Your data is kept for as long as your account exists. You can request
          deletion of your account and all associated data at any time by
          contacting us.
        </p>
      </section>

      <section id="your-rights">
        <SubHeading text="Your rights (GDPR)" />
        <p>
          If you are located in the EU/EEA, you have the right to access,
          correct, or delete your personal data. To exercise any of these
          rights, contact us at <span>[wilma.yasuda@gmail.com]</span>.
        </p>
      </section>

      <section id="cookies">
        <SubHeading text="Cookies" />
        <p>
          We use a session cookie to keep you logged in. No tracking or
          advertising cookies are used.
        </p>
      </section>

      <section id="contact">
        <SubHeading text="Contact" />
        <p>
          If you have any questions about this policy, you can reach us at{" "}
          <span>[wilma.yasuda@gmail.com]</span>.
        </p>
      </section>
    </article>
  );
}

export default PrivacyPolicy;
