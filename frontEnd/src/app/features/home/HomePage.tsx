import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { selectUser } from "../auth/authSlice";
import { Navbar } from "../../components/Navbar";

export const HomePage = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    console.log("user: ", user);
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <>
      <Navbar />
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="font-black text-3xl">
          Welcome Home {user?.username}!
        </div>
      </div>
    </>
  );
};
