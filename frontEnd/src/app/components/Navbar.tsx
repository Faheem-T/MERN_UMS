import { useLogOutUserMutation } from "../features/api/authApi";

interface NavbarProps {
  pfpUrl: string | null | undefined;
  userRole: "admin" | "user" | undefined;
}

export const Navbar = ({ pfpUrl = null, userRole = "user" }: NavbarProps) => {
  const [createLogOutMutation, { isLoading }] = useLogOutUserMutation();
  return (
    <div className="p-4 flex justify-between items-center h-20">
      <div className="font-black text-xl">HOME</div>
      <div className="flex gap-2 h-full justify-between items-center">
        {/* dashboard button that is only displayed for admins */}
        {userRole === "admin" && (
          <button className="border rounded-md p-2">Dashboard</button>
        )}
        <button
          className="border rounded-md p-2"
          onClick={() => {
            createLogOutMutation();
          }}
          disabled={isLoading}
        >
          {isLoading ? "Logging out..." : "Log Out"}
        </button>
        <div className="rounded-full overflow-hidden h-12 w-12 flex items-center justify-center border border-black">
          <img src={pfpUrl ?? "userIcon.jpg"} />
        </div>
      </div>
    </div>
  );
};
