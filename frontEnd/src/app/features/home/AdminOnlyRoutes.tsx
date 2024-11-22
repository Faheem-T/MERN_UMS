import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../auth/authSlice";

export const AdminOnlyRoutes = () => {
  const user = useAppSelector(selectUser);
  if (user?.role === "admin") {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};
