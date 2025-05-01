import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { Calendar, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const CancelBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get(`/api/bookings/${bookingId}`, {
          headers: { Authorization: `${token}` },
        });
        setBooking(response.data);
        
        // Check if cancellation is possible (before check-in date)
        const checkInDate = new Date(response.data.checkIn);
        const today = new Date();
        setCanCancel(checkInDate > today);
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/api/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      setShowConfirmation(true);
    } catch (err) {
      setError("Failed to cancel booking");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cancel Booking</h2>
            
            {booking && (
              <div className="space-y-6">
                {/* Booking Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">Check-in: {formatDate(booking.checkIn)}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">Check-out: {formatDate(booking.checkOut)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600">Total Amount: ₹{booking.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-medium text-yellow-800">Cancellation Policy</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        You can cancel your booking up to 24 hours before check-in. 
                        The refund amount will be transferred to your account within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancellation Status */}
                {!canCancel && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      <p className="text-red-700">
                        This booking cannot be cancelled as the check-in date has passed.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancel Button */}
                {canCancel && !showConfirmation && (
                  <button
                    onClick={handleCancel}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Confirmation Message */}
                {showConfirmation && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />
                      <div>
                        <p className="text-green-800 font-medium">Booking Cancelled Successfully!</p>
                        <p className="text-green-700 text-sm mt-1">
                          Your refund of ₹{booking.totalPrice} will be transferred to your account within 24 hours.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/bookings')}
                      className="mt-4 text-sm text-green-600 hover:text-green-700"
                    >
                      Return to My Bookings
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBooking; 