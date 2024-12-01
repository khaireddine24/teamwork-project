import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Layout from "../components/Layout"; 

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  console.log("user protected",user);
  const token=localStorage.getItem("auth_token")
 
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
