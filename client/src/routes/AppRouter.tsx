import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import ProtectedRoutes from "./ProtectedRoutes.tsx";
import PublicRoute from "./PublicRoutes.tsx";

const AppRouter = () => {
  const Home = lazy(() => import("../pages/home/Home.tsx"));
  const Login = lazy(() => import("../pages/login/Login.tsx"));
  const NotFound = lazy(() => import("../pages/notFound/NotFound.tsx"));
  const Unauthorized = lazy(
    () => import("../pages/unauthorized/Unauthorized.tsx")
  );

  return (
    <Suspense
      fallback={
        <main>
          <h1>Loading . . .</h1>
        </main>
      }
    >
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* user signed in  */}
        <Route element={<ProtectedRoutes allowedRoles={["admin", "user"]} />}>
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
