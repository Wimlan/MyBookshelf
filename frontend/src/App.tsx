import { useState } from "react";
import "./index.css";

import Home from "./pages/Home";
import Bookshelf from "./pages/Bookshelf";
import Createuser from "./pages/Createuser";

import {
  createHashRouter,
  // Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: "/" },
        { element: <Bookshelf />, path: "/bookshelf/:userName" },
        { element: <Createuser />, path: "/createuser" },
      ],
      element: (
        <>
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
