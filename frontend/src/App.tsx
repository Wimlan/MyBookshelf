import "./index.css";

import Home from "./pages/Home";
import Bookshelf from "./pages/Bookshelf";
import CreateUser from "./pages/CreateUser";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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
        { element: <CreateUser />, path: "/createuser" },
        { element: <PrivacyPolicy />, path: "/privacypolicy" },
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
