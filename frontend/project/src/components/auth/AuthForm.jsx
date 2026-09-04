import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getApiError } from "../../services/api";
import {
  Building2,
  Rocket,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import "./AuthForm.css";
import logo from "../../assets/govstart-logo.png";
import skyline from "../../assets/india-skyline.png";

export default function AuthForm({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [direction, setDirection] = useState(1);
  const [role, setRole] = useState("STARTUP");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // LOGIN
  function handleLoginChange(e) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(loginForm.username, loginForm.password);
      const backendRole = user.role?.toUpperCase();
      if (backendRole !== role) {
        setError(
          `This account is registered as ${
            backendRole === "GOVERNMENT" ? "Government" : "Startup"
          }. Please select the correct account type.`
        );
        return;
      }
      if (backendRole === "GOVERNMENT") navigate("/government/dashboard");
      else if (backendRole === "STARTUP") navigate("/startup/dashboard");
      else setError("This account type is not supported by the frontend.");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  // REGISTER
  function handleRegisterChange(e) {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    if (registerForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const user = await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        role: role,
      });
      if (user.role === "government") navigate("/government/dashboard");
      else if (user.role === "startup") navigate("/startup/dashboard");
      else setError("Unknown account role received from server.");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleModeSwitch(newMode) {
    setError("");
    setDirection(newMode === "register" ? 1 : -1);
    setMode(newMode);
  }

  const formVariants = {
    initial: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
      scale: 0.98,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -30 : 30,
      scale: 0.98,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="auth-page-centered">
      {/* Background ambient lighting */}
      <div className="auth-ambient-glow auth-ambient-1" />
      <div className="auth-ambient-glow auth-ambient-2" />
      <div className="auth-bg-grid" />

      {/* Top Header Navigation */}
      <header className="auth-top-nav">
        <Link to="/" className="auth-nav-back">
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </Link>

        <div className="auth-nav-badge">
          <Sparkles size={13} className="text-[#8b4f25]" />
          <span>SIH 2026 · AI Platform</span>
        </div>
      </header>

      {/* Main Container in Center */}
      <main className="auth-center-wrap">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          layout
        >
          {/* Brand Header */}
          <div className="auth-card-header">
            <Link to="/" className="auth-logo-badge">
              <img src={logo} alt="CivicSyncAI Logo" className="auth-logo-img" />
              <span className="auth-logo-text">CivicSyncAI</span>
            </Link>
          </div>

          <div className="auth-card-body">
            <AnimatePresence custom={direction} mode="wait">
              {mode === "login" ? (
                /* ================= LOGIN VIEW ================= */
                <motion.div
                  key="login"
                  custom={direction}
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="auth-step-wrapper"
                >
                  {/* Title & Subtitle */}
                  <div className="auth-title-block">
                    <h1 className="auth-heading">Welcome back</h1>
                    <p className="auth-subtext">
                      Sign in to your CivicSyncAI account
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="auth-error-banner">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Role Picker */}
                  <div className="auth-role-section">
                    <label className="auth-field-label">Select your portal</label>
                    <div className="auth-role-grid">
                      <button
                        type="button"
                        onClick={() => {
                          setRole("GOVERNMENT");
                          setError("");
                        }}
                        className={`auth-role-btn ${
                          role === "GOVERNMENT" ? "selected" : ""
                        }`}
                      >
                        <div className="auth-role-icon-box">
                          <Building2 size={20} />
                        </div>
                        <div className="auth-role-info">
                          <span className="auth-role-title">Government</span>
                          <span className="auth-role-desc">Department / Ministry</span>
                        </div>
                        {role === "GOVERNMENT" && (
                          <div className="auth-role-check">
                            <Check size={12} />
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRole("STARTUP");
                          setError("");
                        }}
                        className={`auth-role-btn ${
                          role === "STARTUP" ? "selected" : ""
                        }`}
                      >
                        <div className="auth-role-icon-box">
                          <Rocket size={20} />
                        </div>
                        <div className="auth-role-info">
                          <span className="auth-role-title">Startup</span>
                          <span className="auth-role-desc">Technology Vendor</span>
                        </div>
                        {role === "STARTUP" && (
                          <div className="auth-role-check">
                            <Check size={12} />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login Fields */}
                  <form onSubmit={handleLogin} className="auth-form-fields">
                    <div className="auth-input-group">
                      <label className="auth-field-label">Username</label>
                      <div className="auth-input-wrap">
                        <User size={18} className="auth-input-icon" />
                        <input
                          type="text"
                          name="username"
                          value={loginForm.username}
                          onChange={handleLoginChange}
                          placeholder="Enter your username"
                          autoComplete="username"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-field-label">Password</label>
                      <div className="auth-input-wrap">
                        <Lock size={18} className="auth-input-icon" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="auth-submit-btn"
                    >
                      {loading ? (
                        <span className="auth-btn-spinner">Signing in...</span>
                      ) : (
                        <span>
                          Sign In to {role === "GOVERNMENT" ? "Government Portal" : "Startup Portal"}
                        </span>
                      )}
                    </button>
                  </form>

                  {/* Footer Switch */}
                  <div className="auth-footer-switch">
                    <span>Don&apos;t have an account?</span>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("register")}
                      className="auth-switch-link"
                    >
                      <span>Create an account</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ================= REGISTER VIEW ================= */
                <motion.div
                  key="register"
                  custom={direction}
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="auth-step-wrapper"
                >
                  {/* Title & Subtitle */}
                  <div className="auth-title-block">
                    <h1 className="auth-heading">Create Account</h1>
                    <p className="auth-subtext">
                      Join India&apos;s AI-driven public procurement ecosystem
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="auth-error-banner">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Role Picker */}
                  <div className="auth-role-section">
                    <label className="auth-field-label">Account category</label>
                    <div className="auth-role-grid">
                      <button
                        type="button"
                        onClick={() => {
                          setRole("GOVERNMENT");
                          setError("");
                        }}
                        className={`auth-role-btn ${
                          role === "GOVERNMENT" ? "selected" : ""
                        }`}
                      >
                        <div className="auth-role-icon-box">
                          <Building2 size={20} />
                        </div>
                        <div className="auth-role-info">
                          <span className="auth-role-title">Government</span>
                          <span className="auth-role-desc">Department / Ministry</span>
                        </div>
                        {role === "GOVERNMENT" && (
                          <div className="auth-role-check">
                            <Check size={12} />
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRole("STARTUP");
                          setError("");
                        }}
                        className={`auth-role-btn ${
                          role === "STARTUP" ? "selected" : ""
                        }`}
                      >
                        <div className="auth-role-icon-box">
                          <Rocket size={20} />
                        </div>
                        <div className="auth-role-info">
                          <span className="auth-role-title">Startup</span>
                          <span className="auth-role-desc">Technology Vendor</span>
                        </div>
                        {role === "STARTUP" && (
                          <div className="auth-role-check">
                            <Check size={12} />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Register Fields */}
                  <form onSubmit={handleRegister} className="auth-form-fields">
                    <div className="auth-input-group">
                      <label className="auth-field-label">Username</label>
                      <div className="auth-input-wrap">
                        <User size={18} className="auth-input-icon" />
                        <input
                          type="text"
                          name="username"
                          value={registerForm.username}
                          onChange={handleRegisterChange}
                          placeholder="Choose a username"
                          autoComplete="username"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-field-label">Official Email</label>
                      <div className="auth-input-wrap">
                        <Mail size={18} className="auth-input-icon" />
                        <input
                          type="email"
                          name="email"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          placeholder={
                            role === "GOVERNMENT"
                              ? "official@gov.in or dept@nic.in"
                              : "founder@startup.com"
                          }
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-field-label">Password</label>
                      <div className="auth-input-wrap">
                        <Lock size={18} className="auth-input-icon" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          placeholder="Minimum 8 characters"
                          minLength={8}
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <label className="auth-field-label">Confirm Password</label>
                      <div className="auth-input-wrap">
                        <Lock size={18} className="auth-input-icon" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={registerForm.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="auth-submit-btn"
                    >
                      {loading ? (
                        <span className="auth-btn-spinner">Creating account...</span>
                      ) : (
                        <span>
                          Register as {role === "GOVERNMENT" ? "Government Body" : "Startup"}
                        </span>
                      )}
                    </button>
                  </form>

                  {/* Footer Switch */}
                  <div className="auth-footer-switch">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("login")}
                      className="auth-switch-link"
                    >
                      <span>Sign In</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card footer trust badge */}
          <div className="auth-card-footer">
            <ShieldCheck size={14} className="text-[#8b4f25]" />
            <span>Encrypted &amp; Compliant with Indian Innovation Standards</span>
          </div>
        </motion.div>
      </main>

      {/* Decorative Bottom Skyline Silhouette */}
      <div className="auth-bg-skyline-wrap">
        <img src={skyline} alt="" className="auth-bg-skyline" />
      </div>
    </div>
  );
}