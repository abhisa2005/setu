import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:4000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // kept, unused on purpose

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password
      });

      // store auth info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // ✅ FORCE LEAVE LOGIN PAGE (THIS IS THE FIX)
      if (res.data.user.role === "admin") {
        window.location.replace("/admin");
      } else {
        window.location.replace("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
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
            your health journey.
          </p>

          <img
            src="/log.png"
            alt="doctor"
            className="left-image"
          />
        </div>
      </div>

      <div className="auth-right">
        <h2 className="title">Log In</h2>

        <div className="social-buttons">
          <button className="social" disabled>
            Continue with Google
          </button>
          <button className="social" disabled>
            Continue with Facebook
          </button>
        </div>

        <div className="divider">OR</div>

        <form className="form" onSubmit={submit}>
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="login-text">
          Don’t have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
}

