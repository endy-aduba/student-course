import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminRegister from '../pages/AdminRegister';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboardCourses from '../pages/AdminDashboardCourses';

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/admin/register' element={<AdminRegister />} />
				{/* <Route path="/admin/register" element={<ProtectedRoute><AdminRegister /></ProtectedRoute>} /> */}
				<Route
					path='/dashboard'
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/students'
					element={
						<ProtectedRoute>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/courses'
					element={
						<ProtectedRoute>
							<AdminDashboardCourses />
						</ProtectedRoute>
					}
				/>
				
			</Routes>
		</Router>
	);
}

export default App;
