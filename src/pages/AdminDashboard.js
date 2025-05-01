import React, { useState, useEffect } from "react";
import axios from "axios";
import roomImage from "./download.jpg";
import { useNavigate, Link } from "react-router-dom";
import { 
  Hotel, Trash2, Edit, Eye, Plus, Users, Book, 
  DollarSign, Percent, TrendingUp, BarChart4, Key, Calendar,
  ArrowRight, ChevronRight, Activity, CreditCard, Clock,
  LayoutDashboard
} from "lucide-react";
import API from "../utils/axiosInstance";

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    occupancyRate: 0,
    totalUsers: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch rooms data
        const roomsRes = await API.get("/api/rooms", {
          headers: { Authorization: `${token}` },
        });
        setRooms(roomsRes.data);
        
        // Fetch users data
        const usersRes = await API.get("/api/admin/usersdata", {
          headers: { Authorization: `${token}` },
        });
        
        const totalRooms = roomsRes.data.length;
        const availableRooms = roomsRes.data.filter(room => room.available).length;
        const bookedRooms = totalRooms - availableRooms;
        const occupancyRate = (bookedRooms / totalRooms) * 100;

        setStats({
          totalRooms,
          availableRooms,
          bookedRooms,
          occupancyRate: occupancyRate.toFixed(1),
          totalUsers: usersRes.data.length
        });
      } catch (error) {
        console.error("Error fetching admin data:", error.response?.data || error);
      }
    };
    fetchAdminData();
  }, []);

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/admin/delete/${roomId}`, {
        headers: { Authorization: `${token}` },
      });
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-900/50 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-slate-400">Manage your hotel operations and monitor performance</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Rooms */}
          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border-l-4 border-indigo-500 hover:border-indigo-400 transition-colors duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-900/50 rounded-md p-3">
                  <Hotel className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Total Rooms</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{stats.totalRooms}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-indigo-400">
                        <Activity className="h-4 w-4 mr-1" />
                        <span>Active</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Available Rooms */}
          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border-l-4 border-emerald-500 hover:border-emerald-400 transition-colors duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-900/50 rounded-md p-3">
                  <Key className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Available Rooms</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{stats.availableRooms}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-emerald-400">
                        <Percent className="h-4 w-4 mr-1" />
                        <span>{((stats.availableRooms / stats.totalRooms) * 100).toFixed(1)}%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Booked Rooms */}
          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border-l-4 border-rose-500 hover:border-rose-400 transition-colors duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-rose-900/50 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-rose-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Booked Rooms</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{stats.bookedRooms}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-rose-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>{stats.occupancyRate}%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-slate-800 overflow-hidden shadow rounded-lg border-l-4 border-violet-500 hover:border-violet-400 transition-colors duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-violet-900/50 rounded-md p-3">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Total Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">{stats.totalUsers}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-violet-400">
                        <BarChart4 className="h-4 w-4 mr-1" />
                        <span>Active</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Quick Actions</h2>
            <div className="text-sm text-slate-400">Manage your hotel operations</div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/addroom"
              className="group relative rounded-lg border border-slate-700 bg-slate-800 px-6 py-5 shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-indigo-900/50 rounded-md p-3">
                  <Plus className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors duration-300">Add New Room</p>
                  <p className="text-sm text-slate-400">Create a new room listing</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors duration-300" />
              </div>
            </Link>

            <Link
              to="/admin/bookedrooms"
              className="group relative rounded-lg border border-slate-700 bg-slate-800 px-6 py-5 shadow-sm hover:border-rose-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-rose-900/50 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-rose-400 transition-colors duration-300">View Bookings</p>
                  <p className="text-sm text-slate-400">Manage room bookings</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-rose-400 transition-colors duration-300" />
              </div>
            </Link>

            <Link
              to="/admin/usersdata"
              className="group relative rounded-lg border border-slate-700 bg-slate-800 px-6 py-5 shadow-sm hover:border-violet-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-violet-900/50 rounded-md p-3">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors duration-300">Manage Users</p>
                  <p className="text-sm text-slate-400">View and manage users</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors duration-300" />
              </div>
            </Link>
          </div>
        </div>

        {/* Room Management */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-900/50 rounded-lg">
                <Hotel className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Room Management</h2>
                <p className="text-sm text-slate-400">Manage your hotel rooms and listings</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Total: <span className="font-semibold text-emerald-400">{rooms.length}</span> rooms
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="group bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-slate-600">
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={room.mainImage}
                    alt={room.name}
                      className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      room.available 
                        ? "bg-emerald-900/80 text-emerald-300" 
                        : "bg-rose-900/80 text-rose-300"
                    }`}>
                      {room.available ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">{room.name}</h3>
                    <div className="flex items-center text-emerald-400">
                        <DollarSign className="h-5 w-5 mr-1" />
                      <span className="font-bold text-lg">{room.price}</span>
                      <span className="text-slate-400 text-sm ml-1">/Month</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-4">{room.type}</p>

                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-white mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(room.amenities) && room.amenities.length > 0 ? (
                        room.amenities.map((amenity, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600"
                          >
                            {amenity.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm">No amenities listed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/admin/update/${room._id}`)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 transition-colors duration-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-rose-700 rounded-lg text-sm font-medium text-rose-400 bg-slate-800 hover:bg-rose-900/20 hover:border-rose-600 transition-colors duration-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                    <Link
                      to={`/room/${room._id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-emerald-700 rounded-lg text-sm font-medium text-emerald-400 bg-slate-800 hover:bg-emerald-900/20 hover:border-emerald-600 transition-colors duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;