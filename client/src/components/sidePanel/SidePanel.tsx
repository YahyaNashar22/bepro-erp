import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import type { IProject } from "../../interfaces/IProject";
import { socket } from "../../utils/socket";

const SidePanel = ({ onChangeView }: { onChangeView: (s: string) => void }) => {
  const { user, logout } = useAuth();

  const isAuthorized = () => user?.role === "admin";

  // socket event listeners
  useEffect(() => {
    const handleCreated = (p: IProject) => alert("Project Created: " + p.name);
    const handleUpdated = (p: IProject) => alert("Project Updated: " + p.name);
    const handleDeleted = (p: IProject) => alert("Project Deleted: " + p.name);
    const handleFileDeleted = (p: IProject) =>
      alert("Project File Deleted: " + p.name);

    socket.on("project_created", handleCreated);
    socket.on("project_updated", handleUpdated);
    socket.on("project_deleted", handleDeleted);
    socket.on("project_file_deleted", handleFileDeleted);

    return () => {
      socket.off("project_created", handleCreated);
      socket.off("project_updated", handleUpdated);
      socket.off("project_deleted", handleDeleted);
      socket.off("project_file_deleted", handleFileDeleted);
    };
  }, []);

  return (
    <aside className="w-64 h-screen bg-[#1a1a1a] border-r border-gray-700 p-4 flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Welcome, {user?.username}</h2>
      <hr className="border-0 h-px bg-linear-to-r from-white/0 via-white/40 to-white/0 mb-1" />
      <hr className="border-0 h-px bg-linear-to-r from-white/0 via-white/40 to-white/0 mb-5" />

      <div className="flex flex-col gap-3 mb-6">
        {isAuthorized() && (
          <button
            className=" text-white py-2 rounded-lg text-left"
            onClick={() => onChangeView("create_project")}
          >
            Create Project
          </button>
        )}

        {isAuthorized() && (
          <button
            className=" text-white py-2 rounded-lg text-left"
            onClick={() => onChangeView("create_user")}
          >
            Create User
          </button>
        )}

        {isAuthorized() && (
          <button
            className=" text-white py-2 rounded-lg text-left"
            onClick={() => onChangeView("create_client")}
          >
            Create Client
          </button>
        )}

        <hr className="border-0 h-px bg-linear-to-r from-white/0 via-white/40 to-white/0" />

        {isAuthorized() && (
          <button
            className=" text-white py-2 rounded-lg text-left"
            onClick={() => onChangeView("view_users")}
          >
            View Users
          </button>
        )}

        {isAuthorized() && (
          <button
            className=" text-white py-2 rounded-lg text-left"
            onClick={() => onChangeView("view_clients")}
          >
            View Clients
          </button>
        )}

        <button
          className=" text-white py-2 rounded-lg text-left"
          onClick={() => onChangeView("view_projects")}
        >
          View Projects
        </button>
      </div>

      <hr className="border-0 h-px bg-linear-to-r from-white/0 via-white/40 to-white/0 mb-5" />

      <button
        onClick={logout}
        className="mt-auto bg-red-600 hover:bg-red-700 hover:border-red-700! text-white py-2 rounded-lg "
      >
        Logout
      </button>
    </aside>
  );
};

export default SidePanel;
