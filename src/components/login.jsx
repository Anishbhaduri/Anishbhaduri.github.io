import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSignup) {
      alert("Signup is not enabled in this version.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
         localStorage.setItem("loggedIn", "true"); // mark logged in
           window.location.href = "/"; // redirect to Home
      }

      if (res.ok) {
        // Store JWT or simple login flag
        localStorage.setItem("loggedIn", "true"); 
        localStorage.setItem("userEmail", email); // optional
        navigate("/dashboard"); // redirect to protected page
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="auth-wrapper"
      >
        <div className="auth-card">
          <div className="auth-header">
            <Leaf className="auth-icon" />
            <h1>Plant Pulse</h1>
            <p>
              {isSignup
                ? "Empowering modern farmers with digital innovation."
                : "Welcome back! Let's cultivate success together."}
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="auth-button">
              {!isSignup ? (
                <>
                  <LogIn size={18} /> Sign In
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              )}
            </button>
          </motion.form>

          <div className="auth-toggle">
            <p>
              Don’t have an account?{" "}
              <button type="button" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
