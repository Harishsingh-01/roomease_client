import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axiosInstance";
import { 
  Search, Filter, ArrowUp, ArrowDown, 
  IndianRupee, Wifi, Coffee, Utensils,
  ChevronRight, ChevronLeft, Star
} from 'lucide-react';

const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(6);
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    setLoading(true);
    API.get(`/api/rooms`, { withCredentials: true })
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, []);

  // Filter rooms based on search term, type, and price range
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || room.type === selectedType;
    
    const matchesPrice = 
      room.price >= priceRange.min && room.price <= priceRange.max;
    
    return matchesSearch && matchesType && matchesPrice;
  });

  // Sort rooms
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Get current rooms for pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = sortedRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(sortedRooms.length / roomsPerPage);

  // Get unique room types for filter
  const roomTypes = ["all", ...new Set(rooms.map(room => room.type))];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Available Rooms
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find your perfect stay from our wide selection of rooms
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Min"
            />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Sort by:</span>
            <button
              onClick={() => handleSort("price")}
              className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Price
              {sortBy === "price" && (
                sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Name
              {sortBy === "name" && (
                sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : currentRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700">No rooms found matching your criteria.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentRooms.map((room) => (
                <div
                  key={room._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                >
                {/* Image Section with Overlay */}
                <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.mainImage}
                      alt={room.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                  {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      room.available 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    }`}>
                      {room.available ? "Available" : "Booked"}
                    </span>
                  </div>

                  {/* Room Type */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-800">
                      {room.type}
                      </span>
                    </div>
                  </div>

                {/* Content Section */}
                  <div className="p-6">
                  {/* Title and Price */}
                    <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">{room.name}</h3>
                      <div className="flex items-center text-green-600">
                      <IndianRupee className="w-5 h-5 mr-1" />
                        <span className="text-xl font-bold">₹{room.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/Month</span>
                      </div>
                    </div>

                    {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities && room.amenities.map((amenity, index) => (
                            <span
                              key={index}
                        className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                        {amenity === 'Wifi' && <Wifi className="w-4 h-4" />}
                        {amenity === 'Coffee' && <Coffee className="w-4 h-4" />}
                        {amenity === 'Restaurant' && <Utensils className="w-4 h-4" />}
                              {amenity}
                            </span>
                          ))}
                        </div>

                    {/* View Details Button */}
                    <Link
                      to={`/room/${room._id}`}
                    className="block w-full text-center bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 relative overflow-hidden group/button"
                    >
                    <span className="relative z-10">View Details</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === page
                    ? "bg-green-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;
