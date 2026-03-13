import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === "production" ? "https://roomeaseserver.onrender.com" : "http://localhost:5000"), 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default API;
//https://roomeaseserver.onrender.com