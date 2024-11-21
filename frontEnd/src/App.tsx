import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { UsersList } from "./UsersList";
import { RegisterPage } from "./app/features/auth/RegisterPage";
import { LoginPage } from "./app/features/auth/LoginPage";
import { HomePage } from "./app/features/home/HomePage";
import { ProtectedPage } from "./app/features/home/ProtectedPage";
import { useInitialCheckQuery } from "./app/features/api/usersApi";
import { useAppDispatch } from "./app/hooks";
import { userLoggedIn } from "./app/features/auth/authSlice";

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
  // useInitialCheckQuery logs the user in automatically
  // if a valid refresh token exists
  const { data, isLoading } = useInitialCheckQuery();
  const dispatch = useAppDispatch();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (data) {
    const refreshToken = data.data.accessToken;
    const user = data.data.user;
    dispatch(userLoggedIn({ refreshToken, user }));
  }

  return <RouterProvider router={router} />;
}

export default App;
