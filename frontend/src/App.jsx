import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "react-hot-toast";


function App() {


	return (
		<div
      className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center relative overflow-hidden'
    >
    <FloatingShape color='bg-blue-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
    <FloatingShape color='bg-purple-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
    <FloatingShape color='bg-pink-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

			<Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<DashboardPage />
					  	</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
							<SignUpPage />
					}
				/>
				<Route
					path='/login'
					element={
							<LoginPage />
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
							<ForgotPasswordPage />
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
							<ResetPasswordPage />
					}
				/>
				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;