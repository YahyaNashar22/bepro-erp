import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import type { IProject } from "../interfaces/IProject";
import { useAuth } from "../context/AuthContext";

const Projects = ({
  handleProjectSelection,
}: {
  handleProjectSelection: (s: string) => void;
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<IProject[]>([]);

  const handleFetch = async () => {
    try {
      const res = await api.post("/project/all", { userId: user?._id });
      setProjects(res.data.payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;

    try {
      await api.delete(`/project/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project._id}
              className="p-4 border border-gray-700 rounded-lg bg-[#1a1a1a]"
              onClick={() => handleProjectSelection(project._id)}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-medium">{project.name}</p>

                  <p className="text-sm text-gray-400">
                    Status: {project.status}
                  </p>

                  <p className="text-sm text-gray-400">Type: {project.type}</p>

                  <p className="text-sm text-gray-400">
                    Source: {project.source}
                  </p>

                  <p className="text-sm text-gray-400">
                    Currency: {project.currency}
                  </p>

                  <p className="text-sm text-gray-400">
                    Clients:{" "}
                    {project.client_id?.map((n) => n.name).join(", ") ||
                      "Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Show details for ${project._id}`)}
                >
                  Details
                </button>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  onClick={() => alert(`Edit project ${project._id}`)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Projects;
