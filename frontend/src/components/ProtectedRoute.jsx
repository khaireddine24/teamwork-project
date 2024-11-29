import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Layout from "../components/Layout"; 

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  console.log("user protected",user);
 
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
