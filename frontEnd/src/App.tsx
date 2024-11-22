import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RegisterPage } from "./app/features/auth/RegisterPage";
import { LoginPage } from "./app/features/auth/LoginPage";
import { HomePage } from "./app/features/home/HomePage";
import { ProtectedRoutes } from "./app/features/home/ProtectedRoutes";
import { useInitialCheckQuery } from "./app/features/api/authApi";
import { useAppDispatch } from "./app/hooks";
import { userLoggedIn } from "./app/features/auth/authSlice";
import { AdminOnlyRoutes } from "./app/features/home/AdminOnlyRoutes";
import { Dashboard } from "./app/features/adminDashboard/Dashboard";

const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    element: <AdminOnlyRoutes />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  // useInitialCheckQuery logs the user in automatically
  // if a valid refresh token exists
  const dispatch = useAppDispatch();

  const { data, isLoading, error } = useInitialCheckQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    console.log(error);
  } else if (data) {
    const refreshToken = data.data.accessToken;
    const user = data.data.user;
    dispatch(userLoggedIn({ refreshToken, user }));
  }

  return <RouterProvider router={router} />;
}

export default App;
