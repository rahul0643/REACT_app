import React, { useState } from "react";
import './login.css';
import { data } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
//   const [username, setusername] = useState("");
//   const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'username') {
      newValue = value.toUpperCase();
       newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
      if (newValue.length > 0 && !isNaN(newValue[0])) {
        newValue = newValue.substring(1);
      }
      
      e.target.value = newValue; 
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };
  
  let userid='';
const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {
      const response = await fetch("http://localhost:8182/v2/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify(formData), // Corrected
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Login Successful!");
        userid=result.username;

        console.log(result);
        console.log(userid);
        console.log("formData.username----",formData.username);
        navigate(result.redirect,{ state: { username: formData.username } });
      } else {
        alert("Login Failed!");
        console.error("Error:", result);
        setFormData({ username: "", password: "" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">Login</div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>User-Id</label>
            <input
              type="text"
              name="username" 
              value={formData.username}
              onChange={handleChange}
              onKeyDown={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">Ok</button>
            <button type="button" className="cancel-button">
              Cancel
            </button>
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
