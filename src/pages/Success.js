import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance"; // Import the axios instance

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isConfirmed) return; // Prevent duplicate requests
    setIsConfirmed(true);

    const confirmBooking = async () => {
      const params = new URLSearchParams(location.search);
      const roomId = params.get("roomId");
      const userId = params.get("userId");
      const checkIn = params.get("checkIn");
      const checkOut = params.get("checkOut");
      const totalPrice = params.get("totalPrice");

      if (!roomId || !userId || !checkIn || !checkOut || !totalPrice) {
        alert("Invalid booking details.");
        return;
      }

      try {
        console.log("📤 Sending booking request...");

        // ✅ Call Backend API to confirm booking
        const response = await API.post("/api/bookings/confirm-booking", {
          roomId,
          userId,
          checkIn,
          checkOut,
          totalPrice,
        });

        console.log("✅ Booking response:", response.data);
        alert("Booking successful!");

        navigate("/bookings"); // Redirect to bookings page
      } catch (error) {
        console.error("❌ Booking confirmation failed:", error);
        alert("Booking failed. Please try again.");
      }
    };

    confirmBooking();
  }, [location, navigate]);

  return <h2>Processing your booking...</h2>;
};

export default SuccessPage;
