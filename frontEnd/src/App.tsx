import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { UsersList } from "./UsersList";
import { RegisterPage } from "./app/features/auth/RegisterPage";
import { LoginPage } from "./app/features/auth/LoginPage";
import { HomePage } from "./app/features/home/HomePage";
import { ProtectedPage } from "./app/features/home/ProtectedPage";
import { useCheckStatusQuery } from "./app/features/api/usersApi";

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
  {
    path: "/protected",
    element: <ProtectedPage />,
  },
]);

function App() {
  // logs the user in automatically if a valid
  // access token exists
  useCheckStatusQuery();
  return <RouterProvider router={router} />;
}

export default App;
