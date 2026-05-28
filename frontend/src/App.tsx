import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Bookshelf from "./pages/Bookshelf";

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
        { element: <Bookshelf />, path: "/bookshelf/:userName" },
      ],
      element: (
        <>
          <nav>
            <ul>
              <li>
                <Link to="/">Hem</Link>
              </li>
              <li>
                <Link to="/bookshelf/wilma">Om oss</Link>
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
