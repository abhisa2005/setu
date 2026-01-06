import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:4000";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if ((!email && !username) || !password) {
      setError("Username/Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email: email || undefined,
        username: username || undefined,
        password,
      });

      localStorage.setItem("token", res.data.token);
      nav("/admin");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-left">
        <div className="left-content">
          <div className="logo">🏥</div>

          <p className="left-text">
            We at <strong>MediCare</strong> are always fully focused on helping
            your child.
          </p>

          <img
            src="/log.png"
            alt="doctor"
            className="left-image"
          />
        </div>
      </div>


      <div className="auth-right">
        <h2 className="title">Create Account</h2>

        <div className="social-buttons">
          <button className="social">Sign up with Google</button>
          <button className="social">Sign up with Facebook</button>
        </div>

        <div className="divider">OR</div>

        <form className="form" onSubmit={submit}>
          <input
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Create Account"}
          </button>
        </form>

        <p className="login-text">
          Already have an Account? <span>Log in</span>
        </p>
      </div>
    </div>
  );
}
