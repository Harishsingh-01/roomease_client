import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import API from "../utils/axiosInstance";
import toast from "react-hot-toast";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Please enter your email address (Check SPAM mail also)", { position: "top-right" });
            return;
        }
        setLoading(true);
        try {
            await API.post("/api/auth/send-otp", { email });
            setOtpSent(true);
            toast.success("OTP sent to your email!", { position: "top-right" });
        } catch (error) {
            toast.error(
                error.response?.data?.message === "Email already registered"
                    ? "Email already registered! Try logging in."
                    : "Failed to send OTP. Try again!",
                { position: "top-right" }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/api/auth/verify-otp", { email, otp, name, password });
            toast.success("Registration successful! Redirecting...", { position: "top-right" });
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            toast.error("Invalid or expired OTP. Try again!", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[A-Za-z\s]+$/.test(value)) {
            setName(value);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0a192f] to-[#064e3b] py-12 px-4">
            {/* Decorative Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>
            
            {/* Glass Card Container */}
            <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] my-auto">
                
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center mb-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                            <img src="/mainlogo.png" alt="Logo" className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-emerald-100/60 text-sm">Join PGify to book your perfect stay</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className="space-y-5">
                    
                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="block text-white/80 text-sm font-medium ml-1">Full Name</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors">
                                <User className="h-5 w-5" />
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                required
                                disabled={otpSent}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 ${otpSent ? "opacity-60 cursor-not-allowed" : ""}`}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="block text-white/80 text-sm font-medium ml-1">Email Address</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors">
                                <Mail className="h-5 w-5" />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={otpSent}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 ${otpSent ? "opacity-60 cursor-not-allowed" : ""}`}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {!otpSent ? (
                        <button
                            type="button"
                            onClick={handleSendOtp}
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
                                    Sending...
                                </span>
                            ) : "Send Verification OTP"}
                        </button>
                    ) : (
                        <div className="space-y-5 animate-fadeIn">
                            {/* OTP Field */}
                            <div className="space-y-1">
                                <label className="block text-white/80 text-sm font-medium ml-1">Verification OTP</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors">
                                        <Shield className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-emerald-400 placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all duration-300 tracking-widest font-mono"
                                        placeholder="0 0 0 0 0 0"
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                            
                            {/* Password Field */}
                            <div className="space-y-1">
                                <label className="text-white/80 text-sm font-medium ml-1">Create Password</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all duration-300"
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
                                        Registering...
                                    </span>
                                ) : "Create Account"}
                            </button>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-sm">
                    <span className="text-white/60">Already have an account? </span>
                    <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
