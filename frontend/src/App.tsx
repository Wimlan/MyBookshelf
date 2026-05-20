import { useState } from "react";
import "./App.css";

import About from "./About";
import Contact from "./Contact";
import Home from "./Home";

import {
  createHashRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: "/" },
        { element: <About />, path: "/about" },
        { element: <Contact />, path: "/contact" },
      ],
      element: (
        <>
          <nav>
            <ul>
              <li>
                <Link to="/">Hem</Link>
              </li>
              <li>
                <Link to="/about">Om oss</Link>
              </li>
              <li>
                <Link to="/contact">Kontakt</Link>
              </li>
            </ul>
          </nav>
          <main>
            <Outlet />
          </main>
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
