import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";
import { Calendar, DollarSign, Clock, Hotel, CreditCard, AlertCircle } from "lucide-react";
import API from "../utils/axiosInstance"; 
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);



const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(null);
  const [pricePerMonth, setPricePerMonth] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [roomDetails, setRoomDetails] = useState(null);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId || decoded._id || decoded.id);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await API.get(`/api/rooms/${roomId}`);
        setPricePerMonth(res.data.price);
        setIsAvailable(res.data.available);
        setRoomDetails(res.data);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (checkIn && pricePerMonth !== null) {
      setTotalPrice(pricePerMonth * months);
    }
  }, [checkIn, pricePerMonth, months]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setCheckIn(selectedDate);
    setDateError("");
    
    // Calculate total price when check-in date changes
    if (selectedDate && pricePerMonth) {
      setTotalPrice(pricePerMonth * months);
    }
  };

  const handleMonthsChange = (e) => {
    const selectedMonths = parseInt(e.target.value);
    setMonths(selectedMonths);
    
    // Calculate total price when months change
    if (checkIn && pricePerMonth) {
      setTotalPrice(pricePerMonth * selectedMonths);
    }
  };

  const calculateCheckOutDate = () => {
    if (!checkIn) return "";
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setMonth(checkOutDate.getMonth() + months);
    
    // Format the date as YYYY-MM-DD
    return checkOutDate.toISOString().split('T')[0];
  };

  const validateBooking = () => {
    if (!checkIn) {
      setDateError("Please select a check-in date");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(checkIn);

    if (selectedDate < today) {
      setDateError("Check-in date must be in the future");
      return false;
    }

    return true;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You need to be logged in to book a room.");
      return;
    }
    if (!isAvailable) {
      alert("This room is already booked.");
      return;
    }
    if (!validateBooking()) {
      return;
    }

    const checkOut = calculateCheckOutDate();
  
    setLoading(true);
    try {
      // Create Stripe checkout session
      const paymentResponse = await API.post("/api/payments/create-checkout-session", {
        price: totalPrice,
        roomId,
        userId,
        checkIn,
        checkOut
      });

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: paymentResponse.data.sessionId 
      });

      if (error) throw new Error(error.message);
    } catch (error) {
      setError("Payment failed! Try again.");
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date for check-in
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg max-w-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hotel className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
            Book Your Stay
          </h2>
          <p className="text-lg text-gray-600">
            Complete your reservation details below
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Room Info Section */}
          {roomDetails && (
            <div className="bg-green-500 text-white px-6 py-4">
              <h3 className="text-xl font-bold">{roomDetails.name}</h3>
              <p className="flex items-center mt-2">
                <DollarSign className="h-5 w-5 mr-1" />
                ₹{pricePerMonth} per Month
              </p>
            </div>
          )}

          {/* Booking Form */}
          <div className="p-6 sm:p-8">
            {!isAvailable ? (
              <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <p className="text-red-600 font-medium">
                  This room is currently unavailable for booking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Check-in Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-In Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={handleDateChange}
                        min={today}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Number of Months */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Months
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={months}
                        onChange={handleMonthsChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Month' : 'Months'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Check-in Date</span>
                      <span>{checkIn ? new Date(checkIn).toLocaleDateString() : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Check-out Date</span>
                      <span>{checkIn ? new Date(calculateCheckOutDate()).toLocaleDateString() : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Duration</span>
                      <span>{months} {months === 1 ? 'Month' : 'Months'}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{totalPrice || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {dateError && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-red-700">{dateError}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !checkIn}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-lg font-medium text-white 
                    ${loading || !checkIn
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    } transition-colors duration-300`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Book Now
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
