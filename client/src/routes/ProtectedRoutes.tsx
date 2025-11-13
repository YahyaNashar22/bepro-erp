import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.tsx";

interface IProtectedRoutesProps {
  allowedRoles?: ("admin" | "user")[];
}

const ProtectedRoutes = ({ allowedRoles }: IProtectedRoutesProps) => {
  const { user, authLoading } = useAuth();

  console.log("protected: ", user);

  if (authLoading) {
    // still checking auth
    return <h1>Checking authentication...</h1>;
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in and role allowed
  return <Outlet />;
};

export default ProtectedRoutes;
