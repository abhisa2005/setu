import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/admin");
    } catch (err) {
      alert("Login failed");
    }
  };
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-2">Login</h2>
      <input className="block w-full mb-2 p-2 border" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="block w-full mb-2 p-2 border" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Login</button>
    </form>
  );
}
