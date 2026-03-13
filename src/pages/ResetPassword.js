import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, Key } from "lucide-react";
import API from "../utils/axiosInstance";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", { position: "top-right" });
      return;
    }
    setLoading(true);
    try {
      const response = await API.post(`/api/auth/reset-password/${token}`, { password });
      toast.success(response.data.message, { position: "top-right" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a192f] to-[#064e3b]">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>
      
      {/* Glass Card Container */}
      <div className="relative w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <Key className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Set New Password</h2>
          <p className="text-emerald-100/60 text-sm">Please enter your new password below</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-white/80 text-sm font-medium ml-1">New Password</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-emerald-400 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-white/80 text-sm font-medium ml-1">Confirm Password</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-emerald-400 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-2 rounded-xl text-white font-semibold text-lg shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-all duration-300 
              ${loading 
                ? "bg-emerald-500/50 cursor-not-allowed" 
                : "bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 active:translate-y-0"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            ) : "Reset Password"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm">
          <Link to="/login" className="inline-flex items-center text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;