import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { UsersList } from "./UsersList";
import { RegisterPage } from "./app/features/auth/RegisterPage";
import { LoginPage } from "./app/features/auth/LoginPage";
import { HomePage } from "./app/features/home/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
