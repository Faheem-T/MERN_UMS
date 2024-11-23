import { Navbar } from "../../components/Navbar";
import { useAppSelector } from "../../hooks";
import { useDeleteUserMutation, useGetUsersQuery } from "../api/usersApi";
import { selectUser } from "../auth/authSlice";

export const Dashboard = () => {
  const user = useAppSelector(selectUser);

  const [createDeleteUserMutation] = useDeleteUserMutation();

  const { data, isLoading } = useGetUsersQuery();
  const users = data?.users;
  let renderedUsers;
  if (!users) renderedUsers = <tr>No users found</tr>;
  else {
    renderedUsers = users.map((user, i) => (
      <tr key={user.id}>
        <td>{i + 1}</td>
        <td className="rounded-full overflow-hidden h-12 w-12 flex items-center justify-center">
          <img
            src={user.pfpUrl || "userIcon.jpg"}
            className="h-full shrink-0"
          />
        </td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>
          <button onClick={() => createDeleteUserMutation(user.id)}>
            Delete
          </button>
        </td>
        <td>
          <button>Edit</button>
        </td>
      </tr>
    ));
  }

  return (
    <div className="min-h-screen">
      <Navbar pfpUrl={user?.pfpUrl} userRole={user?.role} />
      {/* <div className="h"></div> */}
      <div className="flex items-center justify-center">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-3/4">
            <thead>
              <tr>
                <th></th> {/*For count*/}
                <th>IMG</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th></th> {/*Delete Button*/}
                <th></th> {/*Edit Button*/}
              </tr>
            </thead>
            <tbody>{renderedUsers}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};
