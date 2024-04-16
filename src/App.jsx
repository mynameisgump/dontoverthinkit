import { createHashRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";

const router = createHashRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
