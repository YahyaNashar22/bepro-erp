import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { IProject } from "../../interfaces/IProject";
import api from "../../utils/axiosInstance";
import { socket } from "../../utils/socket";

const SidePanel = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState<IProject[] | null>(null);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  // socket connections
  useEffect(() => {
    const handleProjectCreated = (project: IProject) => {
      alert(project.name);
    };

    const handleProjectUpdated = (project: IProject) => {
      alert(project.name);
    };

    const handleProjectDeleted = (project: IProject) => {
      alert(project.name);
    };

    socket.on("project_created", handleProjectCreated);
    socket.on("project_updated", handleProjectUpdated);
    socket.on("project_deleted", handleProjectDeleted);

    return () => {
      socket.off("project_created", handleProjectCreated);
      socket.off("project_updated", handleProjectUpdated);
      socket.off("project_deleted", handleProjectDeleted);
    };
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.post("", {});
        console.log(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProjects(false);
      }
    };
  }, []);

  return (
    <div>
      <h1>Welcome {user?.username}</h1>
      <ul></ul>
    </div>
  );
};

export default SidePanel;
