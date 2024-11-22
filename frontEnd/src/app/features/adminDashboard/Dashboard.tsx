import { Navbar } from "../../components/Navbar";
import { useAppSelector } from "../../hooks";
import { selectUser } from "../auth/authSlice";

export const Dashboard = () => {
  const user = useAppSelector(selectUser);
  return (
    <>
      <Navbar pfpUrl={user?.pfpUrl} userRole={user?.role} />
      <div className="h-screen"></div>
    </>
  );
};
