import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import API from "../utils/axiosInstance";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await API.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset email.");
      toast.error(error.response?.data?.message || "Failed to send reset email.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen min-h-0 min-w-0 flex items-stretch justify-center">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left Side - Image & Text */}
        <div className="md:w-1/2 hidden md:flex flex-col justify-between bg-black/60 relative min-h-[300px]" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1533106272418-ac3034f1b4d5?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="flex items-center mb-8">
              <img src="/mainlogo.png" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-white text-2xl font-bold italic tracking-wide">PGify</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Forgot your password?</h2>
            <p className="text-white/80 text-lg mb-8">Don't worry, we can help you get back in.</p>
          </div>
          <div className="text-center pb-4">
            <span className="bg-white px-4 py-1 rounded-full text-xs text-[#18191A] font-semibold shadow">presented by PGify</span>
          </div>
        </div>
        {/* Right Side - Forgot Password Form */}
        <div className="md:w-1/2 w-full h-full flex flex-col justify-center items-center p-8 bg-[#18191A] min-h-[300px]">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center mb-6">
              <img src="/mainlogo.png" alt="Logo" className="h-10 w-10 mb-2" />
              <span className="text-white text-2xl font-bold italic tracking-wide mb-2">PGify</span>
              <h3 className="text-xl font-semibold text-white/90 mb-4">Request Password Reset</h3>
            </div>
            {message && (
              <div className={`mb-4 p-3 text-sm rounded-md ${message.includes('successfully') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/80 text-sm mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Mail className="h-5 w-5" /></span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${loading ? "bg-[#10bdbd]/60 cursor-not-allowed" : "bg-[#10bdbd] hover:bg-[#0ea5a5]"}`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="text-center text-sm mt-4">
                <span className="text-white/60">Remember your password? </span>
                <Link to="/login" className="text-[#10bdbd] hover:underline font-semibold">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        html, body, #root { height: 100%; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
};

export default ForgotPassword; 