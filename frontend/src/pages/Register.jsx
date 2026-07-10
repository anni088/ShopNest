import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = enter details, 2 = enter OTP
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/otp-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("OTP sent! Please check your email.");
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong sending the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration Successful! Please check your email for OTP.");
        login(data);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="auth-container">
      {step === 1 ? (
        <form onSubmit={sendOtp} className="auth-form">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
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
            minLength={6}
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Verify Email</h2>
          <p>Enter the 6-digit code sent to {email}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
          <button
            type="button"
            className="btn btn-link"
            onClick={sendOtp}
            disabled={loading}
          >
            Resend OTP
          </button>
          <p>
            <button type="button" className="btn btn-link" onClick={() => setStep(1)}>
              Go back
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default Register;
