import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SettingsPage from "./pages/SettingsPage";
import EmployeesPage from "./pages/EmployeesPage"; // Import Manage Employees Page
import OrdersPage from "./pages/OrdersPage";
import Home from "./pages/Home";
import HomeUser from "./pages/HomeUser";
import SettingsUser from "./pages/SettingsUser";
import SuppliersPage from "./pages/SuppliersPage";
import OrdersPageAdmin from "./pages/OrderPageAdmin";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  console.log("App", user?.role);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Auth Pages with Background Design */}
        <Route
          path="/signup"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
              <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
              <FloatingShape color="bg-purple-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
              <FloatingShape color="bg-pink-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
              <SignUpPage />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
              <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
              <FloatingShape color="bg-purple-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
              <FloatingShape color="bg-pink-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
              <LoginPage />
            </div>
          }
        />
        <Route
          path="/verify-email"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
              <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
              <FloatingShape color="bg-purple-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
              <FloatingShape color="bg-pink-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
              <EmailVerificationPage />
            </div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
              <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
              <FloatingShape color="bg-purple-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
              <FloatingShape color="bg-pink-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
              <ForgotPasswordPage />
            </div>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
              <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
              <FloatingShape color="bg-purple-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
              <FloatingShape color="bg-pink-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
              <ResetPasswordPage />
            </div>
          }
        />

        {/* Protected Layout Pages */}
        <Route element={<ProtectedRoute>{user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}</ProtectedRoute>}>
          {/* Dashboard Part */}
          <Route path="/home" element={<Home />} />
          <Route path="/homeu" element={<HomeUser />} />
          {/* Home Part */}
          <Route path="/home" element={<Home />} />
          <Route path="/homeUser" element={<HomeUser />} />
          {/* Settings Part*/}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/SettingsUser" element={<SettingsUser />} />
          {/* Employees Part */}
          <Route path="/employees" element={<EmployeesPage />} />
          {/* Orders Part */}
          <Route path="/orders/admin" element={<OrdersPageAdmin />} />
          <Route path="/orders/user" element={<OrdersPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
