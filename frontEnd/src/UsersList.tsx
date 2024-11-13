import { useGetUsersQuery } from "./app/features/api/usersApi";

export const UsersList = () => {
  const { data, isLoading, isError } = useGetUsersQuery({});

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div className="text-red-600">Error</div>;
  // const handleClick = () => {
  //
  // }
  return (
    <div>
      {/* <button onClick={handleClick}>Fetch Users</button> */}
      {data.map((user: { id: string; name: string }) => (
        <div>
          <div className="font-bold">{user.name}</div>
          <div>{user.id}</div>
        </div>
      ))}
    </div>
  );
};
