import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import roomImage from "./download.jpg";

const Home = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/rooms`, { withCredentials: true }) // Adjust API route as per backend
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  return (
    <div className="p-5 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">Welcome to Our Hotel</h1>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">All Rooms</h2>

      {rooms.length === 0 ? (
        <p className="text-lg text-gray-700">No rooms available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border p-4 rounded-lg shadow-lg flex flex-col justify-between min-h-[380px] bg-white"
            >
              <div>
                {/* Responsive Image */}
                <img
                  src={room.image || roomImage} 
                  alt={room.name}
                  className="w-full h-48 object-cover mb-3 rounded-md"
                />

                {/* Room Details */}
                <h3 className="text-lg md:text-xl font-bold">{room.name}</h3>
                <p className="text-gray-600 text-sm md:text-base">Type: {room.type}</p>
                <p className="text-gray-600 text-sm md:text-base">₹{room.price}/night</p>
                <p className={`text-sm md:text-base font-semibold ${room.available ? "text-green-500" : "text-red-500"}`}>
                  {room.available ? "Available" : "Booked"}
                </p>

                {/* Amenities List */}
                <div className="mt-3">
                  <h4 className="text-md font-semibold">Amenities:</h4>
                  <ul className="list-disc pl-4 text-sm text-gray-700">
                    {room.amenities && room.amenities.length > 0 ? (
                      room.amenities.map((amenity, index) => (
                        <li key={index}>{amenity}</li>
                      ))
                    ) : (
                      <li>No amenities available</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* View Details Button */}
              <Link
                to={`/room/${room._id}`}
                className="text-white text-center rounded-md p-2 mt-4 md:mt-6 bg-green-500 hover:bg-yellow-400 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
