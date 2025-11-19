import { useState } from "react";
import SidePanel from "../../components/sidePanel/SidePanel";
import ProjectForm from "../../components/ProjectForm";
import ClientForm from "../../components/ClientForm";
import UserForm from "../../components/UserForm";
import ProjectViewer from "../../components/projectViewer/ProjectViewer";
import Clients from "../../components/Clients";
import Users from "../../components/Users";
import Projects from "../../components/Projects";

const Home = () => {
  const [activeView, setActiveView] = useState<string>("default");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const handleProjectSelection = (id: string) => {
    setSelectedProjectId(id);
    setActiveView("view_single_project");
  };

  const renderView = () => {
    switch (activeView) {
      case "create_project":
        return <ProjectForm />;

      case "create_user":
        return <UserForm />;

      case "create_client":
        return <ClientForm />;

      case "view_single_project":
        return <ProjectViewer projectId={selectedProjectId} />;

      case "view_users":
        return <Users />;

      case "view_clients":
        return <Clients />;

      case "view_projects":
        return <Projects handleProjectSelection={handleProjectSelection} />;

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h1>Select an option from the sidebar</h1>
          </div>
        );
    }
  };

  return (
    <main className="flex">
      <SidePanel onChangeView={setActiveView} />

      <div className="flex-1 p-6">{renderView()}</div>
    </main>
  );
};

export default Home;
