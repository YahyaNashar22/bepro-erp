import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { IProject } from "../../interfaces/IProject";
import api from "../../utils/axiosInstance";
import { socket } from "../../utils/socket";

const SidePanel = ({
  onChangeView,
  onSelectProject,
}: {
  onChangeView: (s: string) => void;
  onSelectProject: (s: string) => void;
}) => {
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(false);

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

  // fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.post("/project/get-all", {});
        setProjects(res.data.payload);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <aside className="w-64 h-screen bg-[#1a1a1a] border-r border-gray-700 p-4 flex flex-col">
      <h2 className="text-2xl font-semibold mb-6">Welcome, {user?.username}</h2>

      <div className="flex flex-col gap-3 mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-left"
          onClick={() => onChangeView("create_project")}
        >
          Create Project
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-left"
          onClick={() => onChangeView("create_user")}
        >
          Create User
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-left"
          onClick={() => onChangeView("create_client")}
        >
          Create Client
        </button>

        <hr className="border-0 h-px bg-linear-to-r from-white/0 via-white/40 to-white/0" />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-left"
          onClick={() => onChangeView("view_clients")}
        >
          View Clients
        </button>
      </div>

      <hr className="border-0 h-px bg-linear-to-r from-white/0 via-white/40 to-white/0 mb-5" />

      {/* Projects accordion */}
      <div className="border border-gray-600 rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => setOpenAccordion(!openAccordion)}
          className="w-full text-left px-4 py-3 bg-[#222] font-medium flex justify-between items-center"
        >
          <span>Projects</span>
          <span>{openAccordion ? "-" : "+"}</span>
        </button>

        {openAccordion && (
          <div className="px-4 py-3 bg-[#1a1a1a] border-t border-gray-600 max-h-[300px] overflow-y-auto">
            {loadingProjects ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-2">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <li
                      key={project._id}
                      className="cursor-pointer hover:text-blue-400"
                      onClick={() => {
                        onSelectProject(project._id);
                        onChangeView("view_project");
                      }}
                    >
                      {project.name}
                    </li>
                  ))
                ) : (
                  <p>No projects found</p>
                )}
              </ul>
            )}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
      >
        Logout
      </button>
    </aside>
  );
};

export default SidePanel;
