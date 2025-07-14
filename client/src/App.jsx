import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthProvider from './auth/authContext';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeaveRequest from './pages/LeaveRequest';
import MyLeaves from './pages/MyLeaves';
import LeaveBalance from './pages/LeaveBalance';
import PendingRequests from './pages/PendingRequests';
import ResetBalances from './pages/ResetBalances';
import Home from './pages/Home';
import NotFound from './components/NotFound';
import LeaveCalendar from './pages/LeaveCalendar';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leave-request" element={<LeaveRequest />} />
          <Route path="/my-leaves" element={<MyLeaves />} />
          <Route path="/leave-balance" element={<LeaveBalance />} />
          <Route path="/pending" element={<PendingRequests />} />
          <Route path="/reset-leave" element={<ResetBalances />} />
          <Route path="/calendar" element={<LeaveCalendar />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="dark" />
    </AuthProvider>
  );
};

export default App;
