import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { IProject } from "../../interfaces/IProject";
import api from "../../utils/axiosInstance";
import { socket } from "../../utils/socket";

const SidePanel = () => {
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
      {/* Welcome */}
      <h2 className="text-xl font-semibold mb-6">Welcome, {user?.username}</h2>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-left"
          onClick={() => alert("Open Create Project Modal")}
        >
          Create Project
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-left"
          onClick={() => alert("Open Create User Modal")}
        >
          Create User
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-left"
          onClick={() => alert("Open Create Client Modal")}
        >
          Create Client
        </button>
      </div>

      {/* Projects Accordion */}
      <div className="border border-gray-600 rounded-lg overflow-hidden mb-4">
        <button
          onClick={() => setOpenAccordion(!openAccordion)}
          className="w-full text-left px-4 py-3 bg-[#222] font-medium flex justify-between items-center"
        >
          <span>Projects</span>
          <span>{openAccordion ? "−" : "+"}</span>
        </button>

        {/* Accordion Content */}
        {openAccordion && (
          <div
            className="
              px-4 py-3 
              bg-[#1a1a1a] 
              border-t border-gray-600 
              max-h-[300px] 
              overflow-y-auto 
              scrollbar-thin 
              scrollbar-thumb-gray-600 
              scrollbar-track-transparent
            "
          >
            {loadingProjects ? (
              <p>Loading...</p>
            ) : projects.length === 0 ? (
              <p>No projects found</p>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li
                    key={project._id}
                    className="cursor-pointer hover:text-blue-400"
                  >
                    {project.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Logout (bottom) */}
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
