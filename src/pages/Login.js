import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock } from "lucide-react";
import API from "../utils/axiosInstance";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      toast.success("Login successful!", { position: "top-right" });
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate(from);
        }
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Keep it special</h2>
            <p className="text-white/80 text-lg mb-8">Capture your personal memories in a unique way, anywhere.</p>
            <div className="flex space-x-4 mt-8">
              <a href="#" className="text-white hover:text-[#10bdbd] transition"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-[#10bdbd] transition"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-white hover:text-[#10bdbd] transition"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="text-center pb-4">
            <span className="bg-white px-4 py-1 rounded-full text-xs text-[#18191A] font-semibold shadow">presented by PGify</span>
          </div>
        </div>
        {/* Right Side - Login Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-8 bg-[#18191A] min-h-[300px]">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex flex-col items-center mb-6">
              <img src="/mainlogo.png" alt="Logo" className="h-10 w-10 mb-2" />
              <span className="text-white text-2xl font-bold italic tracking-wide mb-2">PGify</span>
              <div className="flex space-x-3 mb-2">
                <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition"><i className="fab fa-facebook-f"></i></button>
                <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition"><i className="fab fa-google"></i></button>
                <button className="border border-white/20 rounded-full p-2 text-white hover:bg-[#10bdbd]/20 transition"><i className="fab fa-linkedin-in"></i></button>
              </div>
              <span className="text-white/60 text-xs mb-2">or use your email account</span>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-white/80 text-sm mb-1">Email</label>
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
              <div>
                <label className="block text-white/80 text-sm mb-1">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Lock className="h-5 w-5" /></span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#232526] text-white placeholder-white/40 border border-white/10 focus:ring-2 focus:ring-[#10bdbd] focus:outline-none transition"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <div className="flex justify-end mb-2">
                <Link to="#" className="text-xs text-[#10bdbd] hover:underline">Forgot your password?</Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${loading ? "bg-[#10bdbd]/60 cursor-not-allowed" : "bg-[#10bdbd] hover:bg-[#0ea5a5]"}`}
              >
                {loading ? "Signing in..." : "SIGN IN"}
              </button>
              <div className="text-center text-sm mt-4">
                <span className="text-white/60">Don't have an account? </span>
                <Link to="/register" className="text-[#10bdbd] hover:underline font-semibold">Sign up</Link>
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

export default Login;
