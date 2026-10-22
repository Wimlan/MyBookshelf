# Google sign-in setup

The frontend uses `@react-oauth/google`, a React wrapper that loads Google's
hosted Google Identity Services SDK.

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth **Web application** client ID.
3. Run `npm install`, then `npm run dev` from this directory. Restart Vite after
   changing environment variables.
4. Ensure the exact frontend origin shown by Vite (for example,
   `http://localhost:5173`) is listed under **Authorized JavaScript origins** in
   Google Cloud Console. Add your production origin there as well.

`.env.local` is ignored by Git. Configure `VITE_GOOGLE_CLIENT_ID` in your hosting
provider's build environment before building the frontend for deployment. Vite
embeds this value in the public frontend bundle: use only the public client ID,
never a client secret. The app reports a configuration error if the ID is missing.

The home page now uses Google's sign-in button instead of email/password login.
After the first verified Google sign-in, `/createuser` lets the user choose a
unique username: 3-30 letters, numbers, underscores, or hyphens (case-sensitive).
Returning users go directly to their bookshelf. Google SDK loading and errors are
handled by a shared Google identity button used for sign-in and account deletion.

The frontend maps Google's SDK response field `credential` to `idToken` and sends
`POST /api/user/google` with JSON `{ "idToken": "<ID token>" }`
and `credentials: "include"`. The backend verifies the Google ID token and returns
`{ "requiresUsername": true }` for new users, or saves an application session and
returns `{ "userName": "..." }` for existing Google accounts.
Errors should use a non-2xx status and JSON `{ "message": "..." }`.
Only a successful backend response with a username navigates to the bookshelf.
The frontend does not decode, log, or persist the Google ID token.
Invalid response formats show a user-friendly retry message. The technical reason
and HTTP status are logged to the browser console without response contents.

New-user verification is stored in a short-lived server session, not in browser
storage. `POST /api/user/google/signup` submits only `{ "username": "..." }`.
Account deletion asks the user to confirm with the same Google account instead
of entering a password. See the root README for backend environment setup and
manual database SQL. No client secret is needed for this ID-token verification flow.

---

# Atom components guideline

h1 => FirstHeader</br>
h2 => SecondaryHeader</br>
label => Label</br>
input => Input</br>
button => Button</br>
My Bookshelf h1 => MainTitle</br>

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
