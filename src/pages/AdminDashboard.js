import React, { useState, useEffect } from "react";
import axios from "axios";
import roomImage from "./download.jpg";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/axiosInstance"; // Import the axios instance

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate(); // ✅ Hook should be at the top inside a component

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const roomsRes = await axios.get("http://localhost:5000/api/rooms", {
          headers: { Authorization: `${token}` },
        });
        setRooms(roomsRes.data);
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
      await axios.delete(`http://localhost:5000/api/admin/delete/${roomId}`, {
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
    <div className="p-5 md:p-10 bg-white rounded">
      <h2 className="text-2xl md:text-3xl font-bold mb-10">Admin Dashboard</h2>
      <h3 className="text-lg md:text-xl font-bold mb-4">All Rooms</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <div key={room._id} className="border bg-yellow-500 p-4 rounded-lg shadow-lg flex flex-col justify-between min-h-[350px]">
            <div>
              <img
                src={room.image || roomImage}
                alt={room.name}
                className="w-full h-48 object-cover mb-3 rounded-md"
              />
              <h3 className="text-lg md:text-xl font-bold">{room.name}</h3>
              <p className="text-gray-600 text-sm md:text-base">Type: {room.type}</p>
              <p className="text-gray-600 text-sm md:text-base">₹{room.price}/night</p>
              <p className={`text-sm font-semibold ${room.available ? "text-green-500" : "text-red-500"}`}>
                {room.available ? "Available" : "Booked"}
              </p>
              <div className="mt-3">
                <h4 className="text-md font-semibold">Amenities:</h4>
                <ul className="list-disc pl-4 text-sm text-gray-700">
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.map((amenity, index) => <li key={index}>{amenity}</li>)
                  ) : (
                    <li>No amenities available</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-3 flex flex-col md:flex-row md:space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
                onClick={() => navigate(`/admin/update/${room._id}`)}
              >
                Update Room
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full md:w-auto"
                onClick={() => handleDelete(room._id)}
              >
                Delete Room
              </button>
              <Link
                to={`/room/${room._id}`}
                className="bg-green-500 text-white px-4 py-2 rounded text-center hover:bg-green-600 w-full md:w-auto"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
