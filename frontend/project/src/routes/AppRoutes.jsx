import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import GovernmentDashboard from '../pages/government/Dashboard';
import ProblemSearch from '../pages/government/ProblemSearch';
import Recommendations from '../pages/government/Recommendations';
import StartupDetails from '../pages/government/StartupDetails';
import GovernmentApplications from '../pages/government/Applications';
import StartupDashboard from '../pages/startup/Dashboard';
import StartupProfile from '../pages/startup/Profile';
import StartupRequests from '../pages/startup/Requests';
import StartupProjects from '../pages/startup/Projects';
import Notifications from '../pages/Notifications';
import DashboardLayout from '../components/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
export default function AppRoutes(){return <Routes>
  <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route path="/government" element={<ProtectedRoute role="government"><DashboardLayout role="government"/></ProtectedRoute>}>
    <Route path="dashboard" element={<GovernmentDashboard/>}/><Route path="search" element={<ProblemSearch/>}/><Route path="recommendations/:id" element={<Recommendations/>}/><Route path="startup/:id" element={<StartupDetails/>}/><Route path="applications" element={<GovernmentApplications/>}/><Route path="notifications" element={<Notifications/>}/>
  </Route>
  <Route path="/startup" element={<ProtectedRoute role="startup"><DashboardLayout role="startup"/></ProtectedRoute>}>
    <Route path="dashboard" element={<StartupDashboard/>}/><Route path="profile" element={<StartupProfile/>}/><Route path="requests" element={<StartupRequests/>}/><Route path="projects" element={<StartupProjects/>}/><Route path="notifications" element={<Notifications/>}/>
  </Route>
</Routes>}
