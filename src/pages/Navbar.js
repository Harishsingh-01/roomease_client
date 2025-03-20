import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        setUserRole(null);
      }
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-yellow-400 text-white hover:bg-yellow-500 p-3 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left side - Navigation Links */}
          <div className="hidden lg:flex space-x-4">
            {userRole !== "admin" && (
              <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Home</Link>
            )}
            <Link to="/availableRooms" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Available Rooms</Link>
            {isAuthenticated("user") && <Link to="/bookings" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">My Bookings</Link>}
            {isAuthenticated("admin") && (
              <>
                <Link to="/addroom" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add Room</Link>
                <Link to="/admin/bookedrooms" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Booked Rooms</Link>
                <Link to="/admin/usersdata" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Users</Link>
                <Link to="/admin" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Dashboard</Link>
              </>
            )}
          </div>

          {/* Right side - Auth Buttons */}
          <div className="hidden lg:flex space-x-4">
            {isAuthenticated() ? (
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
            ) : (
              <>
                <Link to="/login" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Login</Link>
                <Link to="/register" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden block text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)} // Close menu when clicking outside
        ></div>
      )}

      {/* Mobile Dropdown Menu (Floating Overlay) */}
      <div className={`fixed top-0 left-0 w-2/3 h-full bg-yellow-500 text-white flex flex-col items-start p-5 space-y-4 transition-transform duration-300 z-50 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Close Button */}
        <button onClick={() => setMenuOpen(false)} className="self-end text-white mb-4">
          <X size={30} />
        </button>

        {/* Navigation Links */}
        {userRole !== "admin" && <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>}
        <Link to="/availableRooms" onClick={() => setMenuOpen(false)}>Available Rooms</Link>
        {isAuthenticated("user") && <Link to="/bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
        {isAuthenticated("admin") && (
          <>
            <Link to="/addroom" onClick={() => setMenuOpen(false)}>Add Room</Link>
            <Link to="/admin/bookedrooms" onClick={() => setMenuOpen(false)}>Booked Rooms</Link>
            <Link to="/admin/usersdata" onClick={() => setMenuOpen(false)}>Users</Link>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          </>
        )}

        {/* Auth Buttons in Mobile Menu */}
        {isAuthenticated() ? (
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        ) : (
          <>
            <Link to="/login" className="bg-red-500 px-4 py-2 rounded" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="bg-red-500 px-4 py-2 rounded" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
