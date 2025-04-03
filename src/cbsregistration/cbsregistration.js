import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cbsregistration.css";
const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";

const CbsRegistration = () => {
  const [formData, setFormData] = useState({
    regno: "",
    tanNo: "",
    gstinno: "",
    cbsid: "",
    VNDRAPIREQID: "",
  });
  
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const exitform = () => {
    navigate("/mainpage");
  }

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "regno":
        // Registration number validation - alphanumeric with minimum length
        if (!/^[a-zA-Z0-9]{5,}$/.test(value)) {
          error = "Registration number must be at least 5 alphanumeric characters";
        }
        break;
        
      // case "tanNo":
      //   // TAN number validation - Format: AAAA99999A
      //   if (!/^[A-Z]{4}\d{5}[A-Z]{1}$/.test(value)) {
      //     error = "Invalid TAN format. Should be like AAAA99999A";
      //   }
      //   break;
        
      case "gstinno":
        // GSTIN validation - Standard Indian GSTIN format
        if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[Z]{1}[A-Z\d]{1}$/.test(value)) {
          error = "Invalid GSTIN format. Should be like 27AAPFU0939F1ZV";
        }
        break;
        
     
        
      default:
        // For other fields, just ensure they're not empty
        if (!value.trim()) {
          error = `${name} is required`;
        }
    }
    
    return error;
  };

  const validateAllFields = () => {
    let formErrors = {};
    let isValid = true;
    
    // Validate each field
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      const error = validateField(fieldName, fieldValue);
      if (error) {
        formErrors[fieldName] = error;
        isValid = false;
      }
    });
    
    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    console.log("Form Submitted:", formData);
    try {
      const response = await fetch(`${API_BASE_URL}/cbs-reg`,{
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
        
        if(result === ""){
          alert("No such user found!!");
        } else {
          alert(formData.cbsid+" Registered Successfully!!");
          // Reset form after successful submission
          setFormData({
            regno: "",
            tanNo: "",
            gstinno: "",
            cbsid: "",
            VNDRAPIREQID: "",
          });
          setErrors({});
        }
      } else {
        alert("Error registering CBS!");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  };

  // Helper function to render form field with validation
  const renderFormField = (label, name) => (
    <div className="form-group">
      <label>{label}:</label>
      <input 
        type="text" 
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
    <div className="form-container_cbs">
      <div className="form-header">CBS Registration</div>
      <form onSubmit={handleSubmit}>
        {renderFormField("CBS ID", "cbsid")}
        {renderFormField("Reg No", "regno")}
        {renderFormField("TAN No", "tanNo")}
        {renderFormField("GSTIN No", "gstinno")}
        {renderFormField("Vendor ID", "VNDRAPIREQID")}

        <div className="button-group">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="submit-btn" onClick={exitform}>Exit</button>
        </div>
      </form>
    </div>
  );
};

export default CbsRegistration;