import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { IProject } from "../../interfaces/IProject";

const SidePanel = () => {
    const { user } = useAuth();

    const [projects, setProjects] = useState<IProject[] | null>(null);

  return (
    <div>
      <h1>Welcome  {user?.username}</h1>
      <ul>

      </ul>
    </div>
  );
};

export default SidePanel;
