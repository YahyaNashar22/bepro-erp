import { Navigate, Outlet } from "react-router";
import type {IUser} from "../interfaces/IUser.ts";

interface IProtectedRoutesProps {
  user: IUser | null;
  allowedRoles?: ("admin" | "user")[];
}

const ProtectedRoutes = ({ user, allowedRoles }: IProtectedRoutesProps) => {
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
