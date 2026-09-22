import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const { pathname } = useLocation();



  return children;
};

export default ProtectedRoute;
