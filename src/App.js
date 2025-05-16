import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import AvailableRooms from "./pages/AvailableRooms";
// import Payment from "./pages/payment";
import BookRoom from "./pages/BookRoom";
import AddRoom from "./pages/AddRoom";
import RoomDetails from "./pages/RoomDetails";
import Success from "./pages/Success";
import Navbar from "./pages/Navbar";
import { isAuthenticated } from "./utils/auth";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateRoom from "./pages/UpdateRoom";
import AdminBookedRooms from "./pages/AdminBookedRooms"
import UsersData from "./pages/UsersData";
import { isTokenExpired } from "./utils/auth";
import Review from './pages/Review';
import ContactUs from './pages/ContactUs';
import AdminContacts from './pages/AdminContacts';  
import CancelBooking from './pages/CancelBooking';
import AllRooms from './pages/AllRooms';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Navbar />
      <AuthChecker />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/availableRooms" element={<AvailableRooms />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="/all-rooms" element={<AllRooms />} />
        
        {/* Protected User Routes */}
        <Route path="/Bookroom/:roomId" element={<ProtectedRoute><BookRoom /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/review/:bookingId" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
        <Route path="/cancel-booking/:bookingId" element={<ProtectedRoute><CancelBooking /></ProtectedRoute>} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/addroom" element={<AdminRoute><AddRoom /></AdminRoute>} />
        <Route path="/admin/update/:roomId" element={<AdminRoute><UpdateRoom /></AdminRoute>} />
        <Route path="/admin/bookedrooms" element={<AdminRoute><AdminBookedRooms /></AdminRoute>} />
        <Route path="/admin/Usersdata" element={<AdminRoute><UsersData /></AdminRoute>} />
        <Route path="/admin/contacts" element={<AdminRoute><AdminContacts /></AdminRoute>} />

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const AuthChecker = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && isTokenExpired()) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, [location.pathname]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const isAdmin = isAuthenticated("admin");
  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  return children;
};

export default App;
