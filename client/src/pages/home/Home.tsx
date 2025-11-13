import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { logout } = useAuth();
  return <h1 onClick={logout}>Home Page</h1>;
};

export default Home;
