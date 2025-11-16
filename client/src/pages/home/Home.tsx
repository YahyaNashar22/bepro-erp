import SidePanel from "../../components/sidePanel/SidePanel";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { logout } = useAuth();
  return (
    <main>
      <h1 onClick={logout}>Home Page</h1>
      <SidePanel />
    </main>
  );
};

export default Home;
