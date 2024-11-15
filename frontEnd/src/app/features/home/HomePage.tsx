import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { useRefreshAccessTokenQuery } from "../api/usersApi";
// import { useCheckStatusQuery } from "../api/usersApi";

export const HomePage = () => {
  // const { isLoading, data } = useCheckStatusQuery({});
  const navigate = useNavigate();
  const { error } = useRefreshAccessTokenQuery({});
  console.log("Error: ", error);
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    console.log("user: ", user);
    if (!user) navigate("/login");
  }, [user, navigate]);
  // console.log(data);
  return (
    <div>
      <div>Welcome Home!</div>
      {/* {isLoading ? <div>Loading</div> : ""} */}
    </div>
  );
};
