import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings from the backend
  }, []);

  return (
    <div className="container mx-auto p-4">
      {bookings.map(booking => (
        <div key={booking._id} className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900">
                {booking.hotelName}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {booking.status}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">
                  Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          {booking.status === 'confirmed' && (
            <div className="px-4 py-4 sm:px-6">
              <Link
                to={`/cancel-booking/${booking._id}`}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Booking
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBookings; 