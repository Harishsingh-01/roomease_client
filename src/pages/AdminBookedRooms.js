import React, { useEffect, useState } from "react";
import axios from "axios";
import roomImage from "./download.jpg";
import API from "../utils/axiosInstance";
import { Hotel, DollarSign, Info, Calendar, User, Clock, CreditCard } from "lucide-react"; // Import icons

const AdminBookedRooms = () => {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookedRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/api/admin/booked-rooms", {
          headers: { Authorization: `${token}` },
        });
        setBookedRooms(response.data);
      } catch (err) {
        console.error("Error fetching booked rooms:", err);
        setError("Failed to load booked rooms");
      }
    };

    fetchBookedRooms();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hotel className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-2">
            Booked Rooms Dashboard
          </h2>
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Calendar className="h-5 w-5" />
            <p className="text-lg">
              Currently Booked: <span className="font-semibold text-emerald-400">{bookedRooms.length} Rooms</span>
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-rose-900/50 border border-rose-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-rose-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-rose-300">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        <div className="max-w-7xl mx-auto">
          {bookedRooms.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
              <Hotel className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-lg font-medium text-slate-300">No Bookings</h3>
              <p className="mt-1 text-slate-400">No rooms are currently booked.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookedRooms.map((room) => (
                <div
                  key={room._id}
                  className="group bg-slate-800 overflow-hidden rounded-xl shadow-lg border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl"
                >
                  {/* Room Image with Overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.mainImage}
                      alt={room.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">{room.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-emerald-400">
                          <span className="h-5 w-5 mr-1">₹</span>
                          <span className="font-bold text-lg">₹{room.price}</span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-900/80 text-emerald-300">
                          Booked
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    {/* Booking Details */}
                    {room.booking && (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-400" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-slate-300">
                              {room.booking.user?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-slate-400">Booked User</p>
                          </div>
                        </div>

                        {/* Booking Period */}
                        <div className="bg-blue-900/30 p-4 rounded-lg">
                          <div className="flex items-center text-sm text-blue-300 mb-2">
                            <Calendar className="h-5 w-5 mr-2" />
                            <span className="font-medium">Booking Period</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-blue-200 pl-7">
                            <div className="text-center">
                              <p className="font-medium">Check In</p>
                              <p>{formatDate(room.booking.checkIn)}</p>
                            </div>
                            <div className="text-blue-400">→</div>
                            <div className="text-center">
                              <p className="font-medium">Check Out</p>
                              <p>{formatDate(room.booking.checkOut)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment and Status */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-700/50 p-3 rounded-lg">
                            <div className="flex items-center text-sm text-slate-300">
                              <CreditCard className="h-4 w-4 mr-2 text-emerald-400" />
                              <span>Total Paid</span>
                            </div>
                            <p className="text-lg font-semibold text-emerald-400 mt-1">
                              ₹{room.booking.totalPrice || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 p-3 rounded-lg">
                            <div className="flex items-center text-sm text-slate-300">
                              <Clock className="h-4 w-4 mr-2 text-blue-400" />
                              <span>Status</span>
                            </div>
                            <p className={`text-lg font-semibold mt-1 ${
                              room.booking.status === 'booked' 
                                ? 'text-emerald-400' 
                                : 'text-rose-400'
                            }`}>
                              {room.booking.status.charAt(0).toUpperCase() + room.booking.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-slate-700">
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookedRooms;
