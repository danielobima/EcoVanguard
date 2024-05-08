import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MasterProvider from "./context/MasterProvider";
import HomePage from "./pages/home";
import AboutPage from "./pages/about/about";
import HowPage from "./pages/how/how";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/how",
    element: <HowPage />,
  },
]);

function App() {
  return (
    <>
      <MasterProvider>
        <RouterProvider router={router} />
      </MasterProvider>
    </>
  );
}

export default App;
