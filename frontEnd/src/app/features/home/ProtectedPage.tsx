import { useProtectedRouteQuery } from "../api/usersApi";

export const ProtectedPage = () => {
  const { data, isLoading } = useProtectedRouteQuery({});
  if (isLoading) return <div>Loading...</div>;
  console.log(data);
  return <div>Protected Page!</div>;
};
