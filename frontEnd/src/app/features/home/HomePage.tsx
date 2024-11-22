import { useAppSelector } from "../../hooks";
import { useState } from "react";
import { selectUser } from "../auth/authSlice";
import { Navbar } from "../../components/Navbar";
import { ImageUploadModal } from "../../components/ImageUploadModal";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const user = useAppSelector(selectUser);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar pfpUrl={user?.pfpUrl} userRole={user?.role} />
      <div
        className="h-screen w-full flex flex-col items-center justify-center gap-5"
        onClick={() => setModalOpen(false)}
      >
        <div className="rounded-full overflow-hidden h-24 w-24 flex items-center justify-center">
          <img src={user?.pfpUrl ?? "userIcon.jpg"} className="h-full" />
        </div>
        <div className="font-black text-3xl">
          Welcome Home {user?.username}!
        </div>
        {!user?.pfpUrl && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              Upload image
            </button>
            <ImageUploadModal open={modalOpen} />
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/dashboard" className="border rounded-md p-2">
            Dashboard
          </Link>
        )}
      </div>
    </>
  );
};
