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
        <div className="w-screen h-screen min-h-0 min-w-0 flex items-stretch justify-center">
            <div className="flex flex-col md:flex-row w-full h-full">
                {/* Left Side - Image & Text */}
                <div className="md:w-1/2 hidden md:flex flex-col justify-between bg-black/60 relative min-h-[300px]" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <div className="p-8 flex-1 flex flex-col justify-center">
                        <div className="flex items-center mb-8">
                            <img src="/mainlogo.png" alt="Logo" className="h-8 w-8 mr-2" />
                            <span className="text-white text-2xl font-bold italic tracking-wide">PGify</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Start your journey</h2>
                        <p className="text-white/80 text-lg mb-8">Join us and book your perfect stay, anywhere.</p>
                        <div className="flex space-x-4 mt-8">
                            <a href="#" className="text-white hover:text-[#10bdbd] transition"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-white hover:text-[#10bdbd] transition"><i className="fab fa-facebook"></i></a>
                            <a href="#" className="text-white hover:text-[#10bdbd] transition"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    
                </div>
                {/* Right Side - Register Form */}
                <div className="md:w-1/2 w-full h-full flex flex-col justify-center items-center p-8 bg-[#18191A] min-h-[300px]">
                    <div className="w-full max-w-sm mx-auto">
                        <div className="flex flex-col items-center mb-6">
                            <span className="text-white text-2xl font-bold italic tracking-wide mb-2">PGify</span>
                            <div className="flex space-x-3 mb-2">
                                <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition"><i className="fab fa-facebook-f"></i></button>
                                <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition"><i className="fab fa-google"></i></button>
                                <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition"><i className="fab fa-linkedin-in"></i></button>
                            </div>
                        </div>
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div>
                                <label className="block text-white/80 text-sm mb-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><User className="h-5 w-5" /></span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        required
                                        className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                                        placeholder="Enter your full name (letters only)"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm mb-1">Email</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Mail className="h-5 w-5" /></span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${loading ? "bg-[#10bdbd]/60 cursor-not-allowed" : "bg-[#10bdbd] hover:bg-[#0ea5a5]"}`}
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">OTP</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Shield className="h-5 w-5" /></span>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                                                placeholder="Enter OTP"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white/80 text-sm mb-1">Password</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Lock className="h-5 w-5" /></span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                                                placeholder="Create a password"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#10bdbd] transition"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${loading ? "bg-[#10bdbd]/60 cursor-not-allowed" : "bg-[#10bdbd] hover:bg-[#0ea5a5]"}`}
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </button>
                                </>
                            )}
                            <div className="text-center text-sm mt-4">
                                <span className="text-white/60">Already have an account? </span>
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

export default Register;
