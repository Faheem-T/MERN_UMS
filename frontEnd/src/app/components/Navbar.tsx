import { useLogOutUserMutation } from "../features/api/usersApi";

export const Navbar = () => {
  const [createLogOutMutation, { isLoading }] = useLogOutUserMutation();
  return (
    <div className="p-4 flex justify-between">
      <div className="font-black text-xl">HOME</div>
      <button
        className="border rounded-md p-2"
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
