import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "./vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg";
import API from "../utils/axiosInstance";
import { 
  Star, Wifi, Coffee, Utensils, Map, Phone, Clock, Search, 
  ArrowRight, Users, Calendar, DollarSign, Home as HomeIcon, Shield, 
  Heart, Award, ThumbsUp, ChevronRight, ChevronLeft, X, ChevronDown, CheckCircle2, XCircle
} from 'lucide-react';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [statistics, setStatistics] = useState({
    totalRooms: 0,
    availableRooms: 0,
    averageRating: 0,
    satisfactionRate: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
    setLoading(true);
        const [roomsRes, statsRes] = await Promise.all([
          API.get('/api/rooms/featured'),
          API.get('/api/rooms/statistics')
        ]);

        if (!statsRes.data.success) {
          throw new Error(statsRes.data.message || 'Failed to fetch statistics');
        }

        setRooms(roomsRes.data);
        
        // Use the statistics data from the backend
        const stats = statsRes.data.data;
        setStatistics({
          totalRooms: stats.totalRooms,
          availableRooms: stats.availableRooms,
          averageRating: stats.averageRating,
          satisfactionRate: stats.satisfactionRate
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default values in case of error
        setStatistics({
          totalRooms: 0,
          availableRooms: 0,
          averageRating: 0,
          satisfactionRate: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredRooms = rooms.slice(0, 3);

  const testimonials = [
    {
      name: "John Doe",
      role: "Business Traveler",
      text: "The rooms are spacious and well-maintained. The staff is extremely helpful and professional.",
      rating: 5
    },
    {
      name: "Sarah Smith",
      role: "Family Vacation",
      text: "Perfect location and amazing amenities. Our family had a wonderful stay!",
      rating: 4
    },
    {
      name: "Mike Johnson",
      role: "Solo Traveler",
      text: "Great value for money. The room was clean and comfortable.",
      rating: 5
    }
  ];

  const handleSlideChange = (direction) => {
    if (direction === 'left') {
      setCurrentSlide((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
    } else {
      setCurrentSlide((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <div className="relative h-[90vh] bg-slate-900 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="Hostel/PG Hero"
            className="w-full h-full object-cover opacity-40"
        />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Find Your Perfect
                  <span className="text-green-500"> Hostel/PG</span>
            </h1>
                <p className="text-xl text-slate-300 max-w-xl">
                  Affordable, comfortable, and safe accommodations for students and working professionals. Your home away from home.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-500">{statistics.availableRooms}+</div>
                  <div className="text-sm text-slate-300">Rooms Available</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-500">24/7</div>
                  <div className="text-sm text-slate-300">Security</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-500">100%</div>
                  <div className="text-sm text-slate-300">Guest Trust</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-500">{statistics.satisfactionRate}%</div>
                  <div className="text-sm text-slate-300">Satisfaction</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link
                to="/availableRooms"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                  Find Accommodation
                  <ArrowRight className="w-5 h-5" />
              </Link>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                  Search Rooms
                  <Search className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
            </div>
          </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Search Rooms</h2>
              <button
                onClick={() => setShowSearch(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by room name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
          </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredRooms.map(room => (
                <Link
                  key={room._id}
                  to={`/room/${room._id}`}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  <img
                    src={room.mainImage}
                    alt={room.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{room.name}</h3>
                    <p className="text-sm text-gray-600">{room.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">₹{room.price}</span>
                      <span className="text-sm text-gray-500">/Month</span>
            </div>
          </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Rooms */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">Featured Rooms</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Experience comfort and convenience in our carefully curated selection of rooms
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
            <div
              key={room._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
                <div className="relative">
                <img
                  src={room.mainImage}
                  alt={room.name}
                    className="w-full h-64 object-cover"
                />
                  <div className="absolute top-4 right-4">
                    {room.available ? (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500 text-white flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Booked
                    </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-5 h-5 mr-1" />
                      <span className="text-xl font-bold">₹{room.price}</span>
                      <span className="text-sm text-gray-500 ml-1">/Month</span>
                  </div>
                  </div>

                  <p className="text-gray-600 mb-4">{room.type}</p>

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

              <Link
                to={`/room/${room._id}`}
                    className="block w-full text-center bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300"
              >
                View Details
              </Link>
                </div>
            </div>
          ))}
        </div>
      )}

        {/* View All Rooms Button */}
        <div className="text-center mt-12">
          <Link
            to="/all-rooms"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            View All Rooms
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose Us</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Experience the perfect blend of comfort, security, and exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <HomeIcon className="w-8 h-8 text-blue-600" />,
                title: "Comfortable Living",
                description: "Enjoy well-maintained rooms with essential amenities and a homely atmosphere"
              },
              {
                icon: <Utensils className="w-8 h-8 text-blue-600" />,
                title: "Meal Services",
                description: "Access to quality food services and kitchen facilities"
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-600" />,
                title: "24/7 Security",
                description: "Your safety is our priority with round-the-clock security"
              },
              {
                icon: <Heart className="w-8 h-8 text-blue-600" />,
                title: "Supportive Community",
                description: "Join a welcoming community of students and professionals"
              },
              {
                icon: <Award className="w-8 h-8 text-blue-600" />,
                title: "Verified Properties",
                description: "All our properties are verified and meet safety standards"
              },
              {
                icon: <ThumbsUp className="w-8 h-8 text-blue-600" />,
                title: "Guest Satisfaction",
                description: "Join hundreds of satisfied residents who have made this their home"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-slate-800">{feature.title}</h3>
                </div>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">What Our Residents Say</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Hear from our residents about their experiences
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-white p-8 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-600 mb-6">{testimonial.text}</p>
                      <div>
                        <p className="font-semibold text-slate-800">{testimonial.name}</p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSlideChange('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={() => handleSlideChange('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-300"
            >
              <ChevronRight className="w-6 h-6 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your New Home?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Book your accommodation now and enjoy a comfortable stay
          </p>
          <Link
            to="/availableRooms"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Find Accommodation <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default Home;
