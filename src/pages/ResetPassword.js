import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import API from "../utils/axiosInstance";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Optional: Verify the token with the backend on component mount
    // to provide a more user-friendly experience if the token is invalid/expired.
    // For now, we rely on the backend check during the password reset attempt.
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      toast.error("Passwords do not match.", { position: "top-right" });
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await API.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      toast.success(response.data.message, { position: "top-right" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
      toast.error(error.response?.data?.message || "Failed to reset password.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-screen h-screen min-h-0 min-w-0 flex items-stretch justify-center">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left Side - Image & Text */}
        <div className="md:w-1/2 w-full flex flex-col justify-between bg-black/60 relative min-h-[300px]" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="flex items-center mb-8">
              <img src="/mainlogo.png" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-white text-2xl font-bold italic tracking-wide">PGify</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Reset your password</h2>
            <p className="text-white/80 text-lg mb-8">Enter your new password below.</p>
          </div>
          <div className="text-center pb-4">
            <span className="bg-white px-4 py-1 rounded-full text-xs text-[#18191A] font-semibold shadow">presented by PGify</span>
          </div>
        </div>
        {/* Right Side - Reset Password Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 bg-[#18191A] min-h-[300px]">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center mb-6">
              <img src="/mainlogo.png" alt="Logo" className="h-10 w-10 mb-2" />
              <span className="text-white text-2xl font-bold italic tracking-wide mb-2">PGify</span>
              <h3 className="text-xl font-semibold text-white/90 mb-4">Set New Password</h3>
            </div>
            {message && (
              <div className={`mb-4 p-3 text-sm rounded-md ${message.includes('successfully') || message.includes('match') ? (message.includes('match') ? 'bg-red-500' : 'bg-green-500') : 'bg-red-500'} text-white`}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white/80 text-sm mb-1">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Lock className="h-5 w-5" /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Lock className="h-5 w-5" /></span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${loading ? "bg-[#10bdbd]/60 cursor-not-allowed" : "bg-[#10bdbd] hover:bg-[#0ea5a5]"}`}
              >
                {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword; 