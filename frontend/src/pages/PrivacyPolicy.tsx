import { useNavigate } from "react-router-dom";
import Heading from "../components/atoms/Heading";
import SubHeading from "../components/atoms/SubHeading";
import Button from "../components/atoms/Button";
import { handleNav } from "../components/atoms/Button";
import MainTitle from "../components/atoms/MainTitle";

function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <article
      id="privacy-policy"
      className="text-left text-lightest w-3/4 md:w-2/3 lg:w-1/2 mx-auto"
    >
      <MainTitle />
      <section className="pb-3">
        <Heading text="Privacy Policy – My Bookshelf" />
        <p>Last updated: June 2026</p>
        <p>
          <span>My Bookshelf</span> is a personal project created and operated
          by an individual based in Gothenburg, Sweden. It is not affiliated
          with any company or organization.
        </p>
      </section>

      <section id="data" className="border-t-4 pb-3">
        <SubHeading text="What data we collect" />
        <ul className="text-body list-disc list-inside mb-2">
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
        </ul>

        <p>When you use the app, we also store:</p>
        <ul className="text-body list-disc list-inside mb-2">
          <li>
            The <span>books</span> you add to your virtual bookshelf
          </li>
        </ul>
      </section>

      <section id="why-collect" className="border-t-4 pb-3">
        <SubHeading text="Why we collect it" />
        <p>
          We collect this data solely to provide the service — creating your
          account, letting you log in, and saving your bookshelf.
        </p>
      </section>

      <section id="who-share" className="border-t-4 pb-3">
        <SubHeading text="Who we share it with" />
        <p>
          We do not share your data with anyone. No third parties, no
          advertisers, no analytics services.
        </p>
      </section>

      <section id="how-long" className="border-t-4 pb-3">
        <SubHeading text="How long we keep it" />
        <p>
          Your data is kept for as long as your account exists. You can request
          deletion of your account and all associated data at any time by
          contacting us.
        </p>
      </section>

      <section id="your-rights" className="border-t-4 pb-3">
        <SubHeading text="Your rights (GDPR)" />
        <p>
          If you are located in the EU/EEA, you have the right to access,
          correct, or delete your personal data. To exercise any of these
          rights, contact us at <span>[wilma.yasuda@gmail.com]</span>.
        </p>
      </section>

      <section id="cookies" className="border-t-4 pb-3">
        <SubHeading text="Cookies" />
        <p>
          We use a session cookie to keep you logged in. No tracking or
          advertising cookies are used.
        </p>
      </section>

      <section id="contact" className="border-t-4 pb-3">
        <SubHeading text="Contact" />
        <p>
          If you have any questions about this policy, you can reach us at{" "}
          <span>[wilma.yasuda@gmail.com]</span>.
        </p>
      </section>
      <div className="flex justify-center align-center mt-5 mb-10">
        <Button
          value="Go Back"
          click={() => handleNav(`/createuser`, navigate)}
        />
      </div>
    </article>
  );
}

export default PrivacyPolicy;
