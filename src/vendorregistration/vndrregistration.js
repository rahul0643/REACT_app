import React, { useState } from "react";
import "./vndrregistration.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";

const VndrRegistration = () => {
  const [formData, setFormData] = useState({
    PHONENO: "",
    VNDRGSTINNO: "",
    STATE: "",
    NAMEOFCBS: "",
    VNDRNAME: "",
    VNDRREGNO: "",
    VNDRID: "",
    EMAILID: "",
    CBSCLIENTID: "",
    VNDRAPIREQID: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "PHONENO":
        // Check if phone number is 10 digits
        if (!/^\d{10}$/.test(value)) {
          error = "Phone number must be 10 digits";
        }
        break;
        
      // case "VNDRGSTINNO":
      //   // Indian GSTIN format: 2 digit state code + 10 digit PAN + 1 digit entity number + 1 digit check sum + Z
      //   if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
      //     error = "Invalid GSTIN format";
      //   }
      //   break;
        
      case "EMAILID":
        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
        
      // case "VNDRREGNO":
      //   // Ensure it's not empty and has at least 5 characters
      //   if (value.length < 5) {
      //     error = "Registration number should be at least 5 characters";
      //   }
      //   break;
        
      
      default:
        // For other fields, just ensure they're not empty
        if (!value.trim()) {
          error = `${name} is required`;
        }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate the field as the user types
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    
    // Validate each field
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      const error = validateField(fieldName, fieldValue);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const navigate = useNavigate();
  
  const exitform = () => {
    navigate("/mainpage");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    
    console.log("Form Submitted:", formData);
    try {
      const response = await fetch(`${API_BASE_URL}/vendor-reg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.text();

      if (response.ok) {
        console.log("ok response");
        console.log(result);

        if (result === "") {
          alert("No such user found!!");
        } else {
          alert("Registered Successfully!!");
          // Reset form after successful submission
          setFormData({
            PHONENO: "",
            VNDRGSTINNO: "",
            STATE: "",
            NAMEOFCBS: "",
            VNDRNAME: "",
            VNDRREGNO: "",
            VNDRID: "",
            EMAILID: "",
            CBSCLIENTID: "",
            VNDRAPIREQID: "",
          });
          setErrors({});
        }
      } else {
        alert("Error registering vendor!");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  };

  // Helper function to render input field with error message
  const renderFormField = (label, name, type = "text") => (
    <div className="form-group">
      <label>{label}:</label>
      <input 
        type={type} 
        name={name} 
        value={formData[name]} 
        onChange={handleChange} 
        className={errors[name] ? "input-error" : ""}
        required 
      />
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="form-container_vndr">
      <div className="form-header">Vendor Registration</div>
      <form onSubmit={handleSubmit}>
        {renderFormField("Phone No.", "PHONENO")}
        {renderFormField("Vendor GSTIN No.", "VNDRGSTINNO")}
        {renderFormField("State", "STATE")}
        {renderFormField("Name of CBS", "NAMEOFCBS")}
        {renderFormField("Vendor Name", "VNDRNAME")}
        {renderFormField("Vendor Reg No.", "VNDRREGNO")}
        {renderFormField("Vendor ID", "VNDRID")}
        {renderFormField("Email ID", "EMAILID", "email")}
        {renderFormField("CBS Client ID", "CBSCLIENTID")}
        {renderFormField("Vendor API Request ID", "VNDRAPIREQID")}
        
        <div className="button-group">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="submit-btn" onClick={exitform}>Exit</button>
        </div>
      </form>
    </div>
  );
};

export default VndrRegistration;