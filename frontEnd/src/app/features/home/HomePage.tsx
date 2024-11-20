import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
// import { useAuth } from "../api/usersApi";
import { selectUser, userLoggedOut } from "../auth/authSlice";
// import { useCheckStatusQuery } from "../api/usersApi";

export const HomePage = () => {
  // const { isLoading, data } = useCheckStatusQuery({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  // const { user, isLoading: isAuthLoading } = useAuth();
  // const { error, data, isLoading } = useRefreshAccessTokenQuery({});
  // console.log("Error: ", error);

  useEffect(() => {
    console.log("user: ", user);
    if (!user) navigate("/login");
  }, [user, navigate]);

  // if (isAuthLoading) return <div>Loading...</div>;
  // const user = useAppSelector((state) => state.auth.user);
  // console.log(data);
  return (
    <div>
      <div>Welcome Home {user?.username}!</div>
      <button
        onClick={() => {
          // dispatch(userLoggedOut());
          // trigger({}).then(console.log);
        }}
      >
        Log Out
      </button>
    </div>
  );
};
