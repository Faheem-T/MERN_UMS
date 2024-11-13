import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { UsersList } from "./UsersList";
import { SignupPage } from "./app/features/auth/SignupPage";

const router = createBrowserRouter([{ path: "/", element: <SignupPage /> }]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
