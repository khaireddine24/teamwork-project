import { Navigate } from "react-router-dom";
import Layout from './Layout';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const user=localStorage.getItem("auth_store");
  console.log('token protected',token);
  if (!token || !user) {
    console.log("err2",user,token);
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;