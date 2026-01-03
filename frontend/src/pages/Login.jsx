import "./Login.css";
import { motion } from "framer-motion";

export default function CreateAccount() {
  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >

      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="left-content">
          <div className="logo">🏥</div>
          <p className="left-text">
            We at <strong>MediCare</strong> are always fully focused on helping your child.
          </p>

          <img
            src="/log.png"
            alt="Medical Illustration"
            className="left-image"
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <h2 className="title">Create Account</h2>

        <div className="social-buttons">
          <button className="social google">Sign up with Google</button>
          <button className="social facebook">Sign up with Facebook</button>
        </div>

        <div className="divider">OR</div>

        <form className="form">
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button className="primary-btn">Create Account</button>
        </form>

        <p className="login-text">
          Already have an Account? <span>Log in</span>
        </p>
      </div>

    </motion.div>

  );
}
