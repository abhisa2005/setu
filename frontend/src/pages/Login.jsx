import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/auth/login`,
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      nav("/admin");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen my-[-8%]  flex items-center justify-center  p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[40%]  "
      >
        <div className="rounded-3xl shadow-2xl bg-white/10 backdrop-blur-xl p-6 ">
          <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow">Welcome Back</h2>
          <p className="text-center text-white/80 mb-8 text-md">Login to access the admin panel</p>

          <form onSubmit={submit} className="space-y-5">
            <div className="relative w-[70%] mx-auto mb-[1%]">
              <Mail className="absolute left-4 top-3.5 text-white/70" size={20} />
              <input
                className="w-full text-2xl text-center px-[0.2rem] py-[0.2rem] rounded-2xl bg-gray-700 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative w-[70%] mx-auto mb-[1%]">
              <Lock className="absolute left-2 top-3.5 text-white/70" size={20} />
              <input
                className="w-full text-2xl text-center px-[0.2rem] py-[0.2rem] rounded-2xl bg-gray-700 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-[70%] cursor-pointer mx-auto block p-[0.5rem] text-lg rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
            >
              Login
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
