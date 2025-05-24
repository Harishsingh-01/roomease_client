import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaGoogle, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/bookings"); // Redirect to bookings if logged in
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      toast.success(response.data.message, { position: "top-right" });
      setTimeout(() => {
        navigate("/login");
      }, 1000); // Redirect to login after 1 second
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.", { position: "top-right" });
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
        <div className="md:w-1/2 w-full flex flex-col justify-between bg-black/60 relative min-h-[300px] hidden md:flex" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="flex items-center mb-8">
              <span className="text-white text-2xl font-bold italic tracking-wide">PGify</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Join Our Community</h2>
            <p className="text-white/80 text-lg mb-8">Create an account to book your dream PG and manage your stays.</p>
            <div className="flex space-x-4 mt-8">
              <a href="#" className="text-white hover:text-[#10bdbd] transition\"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-[#10bdbd] transition\"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white hover:text-[#10bdbd] transition\"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        {/* Right Side - Registration Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 bg-[#18191A] min-h-[300px]">
           <div className="w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center mb-6">
               <img src="/mainlogo.png" alt="Logo" className="h-10 w-10 mb-2" />
              <span className="text-white text-2xl font-bold italic tracking-wide mb-2">PGify</span>
               <div className="flex space-x-3 mb-2">
                 <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition\"><i className="fab fa-facebook-f"></i></button>
                 <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition\"><i className="fab fa-google"></i></button>
                 <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition\"><i className="fab fa-linkedin-in"></i></button>
              </div>
            </div>
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-white/80 text-sm mb-1">Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40\"><User className="h-5 w-5" /></span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Email</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40\"><Mail className="h-5 w-5" /></span>
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
              <div>
                <label className="block text-white/80 text-sm mb-1">Password</label>
                <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40\"><Lock className="h-5 w-5" /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                    placeholder="Enter your password"
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
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40\"><Lock className="h-5 w-5" /></span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                    placeholder="Confirm your password"
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
                {loading ? "Registering..." : "SIGN UP"}
              </button>
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
}

export default Register;
