import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { useProtectedRouteQuery } from "../api/authApi";
import { selectUser } from "../auth/authSlice";
import React from "react";

export const ProtectedRoutes = () => {
  const user = useAppSelector(selectUser);
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
};
