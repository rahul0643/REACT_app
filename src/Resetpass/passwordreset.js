import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./passwordreset.css";
import { useLocation } from "react-router-dom";

// http://localhost:8182/loginv2-0.0.1-SNAPSHOT/v2

const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";


const PasswordReset = () => {
//   const [userId, setUserId] = useState("RBB");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const exitform=()=>{
    navigate("/root");
  }

  const location = useLocation();
    const username = location.state?.username || "";

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasAlphanumeric = /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    const allowedSpecialChars = /[@#*]/.test(password);
    const noOtherSpecialChars = /^[A-Za-z0-9@#*]+$/.test(password);

    if (!minLength) return "Password should be at least 8 characters long.";
    if (!hasAlphanumeric) return "Password must be alphanumeric.";
    if (!allowedSpecialChars)
      return "Password must contain at least one special character (@, #, *).";
    if (!noOtherSpecialChars)
      return "Only @, #, and * are allowed as special characters.";

    return ""; // No error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword(newPassword);

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and Confirm password must match.");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError("");
      } else {
        setError(data.message);
        setSuccess("");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
      setSuccess("");
    }
  };

    

    

  return (
    <div className="container">
      <h3>Password Reset</h3>
      

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User ID:</label>
          {/* <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="RBB">RBB</option>
          </select> */}
          <input
            type="username"
            value={username}
            required
            disabled
          />
        </div>

        <div className="form-group">
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="buttons">
          <button type="submit">Ok</button>
          <button type="button" onClick={exitform }>Cancel</button>
        </div>
      </form>

      <div className="note">
        <p>Password should contain a minimum of 8 characters.</p>
        <p>Password should be alphanumeric and include at least one special symbol (@, #, *).</p>
        <p>Special symbols other than (@, #, *) are not allowed.</p>
      </div>
    </div>
  );
};

export default PasswordReset;
