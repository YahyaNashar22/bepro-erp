import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.tsx";
import CheckingAuth from "../components/CheckingAuth.tsx";

interface IProtectedRoutesProps {
  allowedRoles?: ("admin" | "user")[];
}

const ProtectedRoutes = ({ allowedRoles }: IProtectedRoutesProps) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    // still checking auth
    return <CheckingAuth />;
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
