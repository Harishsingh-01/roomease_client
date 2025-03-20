import React, { useState } from "react";
import axios from "axios";

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    name: "",
    type: "",
    price: "",
    amenities: "",
    description: "",
    available: "true",
    imageUrl: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const formattedData = {
        ...roomData,
        price: Number(roomData.price),
        amenities: roomData.amenities.split(",").map((a) => a.trim()),
        available: roomData.available === "true",
      };
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/admin/addrooms",
        formattedData,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.status === 201) {
        setMessage({ type: "success", text: res.data.message });
        setRoomData({
          name: "",
          type: "",
          price: "",
          amenities: "",
          description: "",
          available: "true",
          imageUrl: "",
        });
      } else {
        setMessage({ type: "error", text: "Failed to add room. Please try again." });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Add a New Room</h2>

      {message.text && (
        <p className={`mb-4 p-2 text-center rounded ${message.type === "success" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Room Name"
          value={roomData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded text-lg"
        />
        <input
          type="text"
          name="type"
          placeholder="Room Type (Single, Double, Suite)"
          value={roomData.type}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded text-lg"
        />
        <input
          type="number"
          name="price"
          placeholder="Price per night (₹)"
          value={roomData.price}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded text-lg"
        />
        <input
          type="text"
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={roomData.amenities}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded text-lg"
        />
        <textarea
          name="description"
          value={roomData.description}
          placeholder="Enter Description"
          onChange={handleChange}
          required
          className="w-full p-3 border rounded text-lg"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={roomData.imageUrl}
          onChange={handleChange}
          className="w-full p-3 border rounded text-lg"
        />
        <select
          name="available"
          value={roomData.available}
          onChange={handleChange}
          className="w-full p-3 border rounded text-lg"
        >
          <option value="true">Available</option>
          <option value="false">Booked</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded text-lg hover:bg-blue-600 transition">
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
