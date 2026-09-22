import { Route, Routes } from "../utils/imports";
import { routes } from "../utils/routes";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        {routes.map((route) => {
          if (route.path !== "/") {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            );
          }
          return (
            <Route key={route.path} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </div>
  );
};

export default AppRoutes;
