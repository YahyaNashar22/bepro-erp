import { useState } from "react";
import SidePanel from "../../components/sidePanel/SidePanel";
import ProjectForm from "../../components/ProjectForm";
import ClientForm from "../../components/ClientForm";
import UserForm from "../../components/UserForm";
import ProjectViewer from "../../components/projectViewer/ProjectViewer";

const Home = () => {
  const [activeView, setActiveView] = useState<string>("default");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const renderView = () => {
    switch (activeView) {
      case "create_project":
        return <ProjectForm />;

      case "create_user":
        return <UserForm />;

      case "create_client":
        return <ClientForm />;

      case "view_project":
        return <ProjectViewer projectId={selectedProjectId} />;

      default:
        return <h1>Select an option from the sidebar</h1>;
    }
  };

  return (
    <main className="flex">
      <SidePanel
        onChangeView={setActiveView}
        onSelectProject={setSelectedProjectId}
      />

      <div className="flex-1 p-6">{renderView()}</div>
    </main>
  );
};

export default Home;
