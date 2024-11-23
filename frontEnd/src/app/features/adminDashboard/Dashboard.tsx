import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { useAppSelector } from "../../hooks";
import { useDeleteUserMutation, useGetUsersQuery } from "../api/usersApi";
import { selectUser } from "../auth/authSlice";
import { UserType } from "../../utils/types";
import { UpdateUserModal } from "./UpdateUserModal";
import { CreateUserModal } from "./CreateUserModal";

export const Dashboard = () => {
  const user = useAppSelector(selectUser);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pattern = new RegExp(searchQuery.trim(), "i");

  const [createDeleteUserMutation] = useDeleteUserMutation();

  const { data, isLoading } = useGetUsersQuery();

  const users = data?.users;
  const filteredUsers = users?.filter((user) => {
    return pattern.test(user.username) || pattern.test(user.email);
  });
  let renderedUsers;
  if (!filteredUsers) renderedUsers = <tr>No users found</tr>;
  else {
    renderedUsers = filteredUsers.map((user, i) => (
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
          <button
            onClick={() => createDeleteUserMutation(user.id)}
            className="border p-2 rounded-md"
          >
            Delete
          </button>
        </td>
        <td>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isUpdateModalOpen) {
                setUserBeingEdited(user);
                setIsUpdateModalOpen(true);
              }
            }}
            className="border p-2 rounded-md"
          >
            Edit
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <div
      className="min-h-screen"
      onClick={() => {
        setIsUpdateModalOpen(false);
        setIsCreateModalOpen(false);
      }}
    >
      <Navbar pfpUrl={user?.pfpUrl} userRole={user?.role} />
      {/* <div className="h"></div> */}
      <div className="flex flex-col items-center justify-center m-2">
        <input
          className="w-1/2 p-2 rounded-lg"
          placeholder="Search for user"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-center">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-3/4">
            <thead>
              <tr>
                <th></th>
                {/*For count*/}
                <th>IMG</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th></th>
                {/*Delete Button*/}
                <th></th>
                {/*Edit Button*/}
              </tr>
            </thead>
            <tbody>{renderedUsers}</tbody>
          </table>
        )}
      </div>
      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        user={userBeingEdited}
        setIsOpen={setIsUpdateModalOpen}
      />

      <div className="flex items-center justify-center m-8">
        <button
          className="border p-2 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            setIsCreateModalOpen(true);
          }}
        >
          CREATE NEW USER
        </button>
      </div>
      <CreateUserModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
      />
    </div>
  );
};
