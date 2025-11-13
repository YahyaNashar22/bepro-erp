import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <h1>Checking authentication...</h1>;
  }

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise allow access to public routes (like /login)
  return <Outlet />;
};

export default PublicRoute;
