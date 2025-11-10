import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import ProtectedRoutes from "./ProtectedRoutes.tsx";
import type { IUser } from "../interfaces/IUser.ts";

const AppRouter = () => {
  const Home = lazy(() => import("../pages/home/Home.tsx"));
  const Login = lazy(() => import("../pages/login/Login.tsx"));
  const NotFound = lazy(() => import("../pages/notFound/NotFound.tsx"));
  const Unauthorized = lazy(
    () => import("../pages/unauthorized/Unauthorized.tsx")
  );

  const user: IUser = {username: 'yahya', role: 'user'};
  return (
    <Suspense
      fallback={
        <main>
          <h1>Loading . . .</h1>
        </main>
      }
    >
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* user signed in  */}
        <Route
          element={
            <ProtectedRoutes user={user} allowedRoles={["admin", "user"]} />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
