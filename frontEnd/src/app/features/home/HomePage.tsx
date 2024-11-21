import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
// import { useAuth } from "../api/usersApi";
import { selectUser, userLoggedOut } from "../auth/authSlice";
import { useLogOutUserMutation } from "../api/usersApi";
// import { useCheckStatusQuery } from "../api/usersApi";

export const HomePage = () => {
  // const { isLoading, data } = useCheckStatusQuery({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [createLogOutMutation, { isLoading }] = useLogOutUserMutation();

  useEffect(() => {
    console.log("user: ", user);
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <div>
      <div>Welcome Home {user?.username}!</div>
      <button
        onClick={() => {
          createLogOutMutation();
        }}
        disabled={isLoading}
      >
        {isLoading ? "Logging out..." : "Log Out"}
      </button>
    </div>
  );
};
