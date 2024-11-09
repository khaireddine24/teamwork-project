import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import DashboardPage from "../pages/DashboardPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (user) {
    return (
      <DashboardPage/>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;