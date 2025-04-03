import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./registrationform.css";
import SearchUserDialog from "./searchuserdialog";
import BranchLovDialog from "./branchlovdialog";
import Unposted from "./unposted";
const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";

// http://localhost:8182/loginv2-0.0.1-SNAPSHOT/v2


const RegistrationForm = () => {
  const [isSaved, setIsSaved] = useState(false);//for disabling fields
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [isUnpostedDialogOpen, setIsUnpostedDialogOpen] = useState(false);
  const [itemsPerPage] = useState(3);
  const [branches, setBranches] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    branchCode: "",
    branchName: "",
    name: "",
    dob: "",
    empId: "",
    address: "",
    city: "",
    phone: "",
    username: "",
    password: "",
    level: "2",
    functionGroup: "",
    status: "1",
    subLevel: "",
    exceptionPassword: "",
    role: "",
    closingDate: "",
    period: "",
    expiryDate: "",
    hoOfficer: false,
    mobileUser: false,
  });

   // List of fields that should remain disabled even in edit mode
   const nonEditableFields = ["username", "password", "dob", "branchCode", "branchName", "address", "city"];

  const navigate = useNavigate();

  const handleUserSelect = (userData) => {
    // Populate the form with the selected user data
    console.log("user data-----",userData.user_id);
    setFormData({
      branchCode: userData.BRANCHCODE || "",
      branchName: userData.branchname || "",
      username: userData.user_id || "",
      password: userData.user_char || "",
      name: userData.NAME || "",
      dob: userData.DOB || "",
      empId: userData.EMPID || "",
      address: userData.ADDRESS || "",
      expiryDate: userData.EXP_DATE || ""
      
    });
    setIsSaved(true);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/branch-codes`)
      .then((response) => response.json())
      .then((data) => {
        const formattedBranches = data.map((item) => {
          const [branchName, branchCode] = item.split(",");
          return { branchCode: branchCode.trim(), branchName: branchName.trim() };
        });
        console.log("Branch Data:", data); // Debug API response
        setBranches(formattedBranches);
        //setBranches(Array.isArray(data) ? data : []); // Ensure it's an array
      })
      .catch((error) => {
        console.error("Error fetching branch codes:", error);
        setBranches([]); // Prevent null issues
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "branchCode") {
      // Find the selected branch object from the array
      const selectedBranch = branches.find((branch) => branch.branchCode === value);
      setFormData({
        ...formData,
        branchCode: value,
        branchName: selectedBranch ? selectedBranch.branchName : "",
      });
    }
    else if (name === "level") {
      // Map the displayed text to the numerical value
      const levelValue = value === "operator" ? "2" : "3";
      setFormData({ ...formData, [name]: levelValue });
    } else if (name === "status") {
      // Map the displayed text to the numerical value
      const statusValue = value === "Working" ? "1" : "0";
      setFormData({ ...formData, [name]: statusValue });
    }  else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // setFormData({
  //   ...formData,
  //   [name]: type === "checkbox" ? checked : value,
  // });

  const onCancle=()=>{
    window.location.reload();
  }

  const openDialog = () => {
    setCurrentPage(1); // Reset to first page when opening dialog
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Branch dialog functions
  const openBranchDialog = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
    setIsBranchDialogOpen(true);
    }
  };

  const closeBranchDialog = () => {
    setIsBranchDialogOpen(false);
  };

  const handleBranchSelect = (branchCode, branchName) => {
    setFormData({
      ...formData,
      branchCode,
      branchName
    });
    closeBranchDialog();
  };

  const selectBranch = (branchCode, branchName) => {
    setFormData({ ...formData, branchCode, branchName });
    closeDialog();
  };

  const fetchBranches = (searchValue) => {
    fetch(`${API_BASE_URL}/branch-codes?query=${searchValue}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedBranches = data.map((item) => {
          const [branchName, branchCode] = item.split(",");
          return { branchCode: branchCode.trim(), branchName: branchName.trim() };
        });
        setBranches(formattedBranches);
        setCurrentPage(1); // Reset to first page when opening dialog
        setIsDialogOpen(true); // Open dialog after fetching
      })
      .catch((error) => console.error("Error fetching branch codes:", error));
  };

  // Handle branchCode input changes
  const handleBranchCodeChange = (e) => {
    setFormData({ ...formData, branchCode: e.target.value });
  };

  // Open dialog when Tab is pressed in branchCode field
  const handleBranchCodeKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default Tab behavior
      fetchBranches(formData.branchCode);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault(); // Prevent default tabbing behavior

      // Validation: Expiry date should be greater than today
      if (e.target.name === "expiryDate") {
        const today = new Date().toISOString().split("T")[0]; // Get today's date
        if (formData.expiryDate && formData.expiryDate <= today) {
          alert("Expiry date must be greater than today's date.");
          return;
        }
      }

      // Validation: Phone number must be exactly 10 digits
      if (e.target.name === "phone") {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
          alert("Phone number must be exactly 10 digits.");
          return;
        }
      }

      // Validation: Required fields
      const requiredFields = ["branchCode", "branchName", "name", "dob", "empId", "address", "city", "phone", "username", "password"];
      if (requiredFields.includes(e.target.name) && !formData[e.target.name]) {
        alert(`${e.target.name} is required.`);
        return;
      }

      // Move focus to the next field manually
      const formElements = Array.from(e.target.form.elements);
      const index = formElements.indexOf(e.target);
      if (index !== -1 && index < formElements.length - 1) {
        formElements[index + 1].focus();
      }
    }
  };


  const exitform = () => {
    navigate("/mainpage");
  }

  // Search functionality
  const openSearchDialog = () => {
    setIsSearchDialogOpen(true);
  };

  const closeSearchDialog = () => {
    setIsSearchDialogOpen(false);
  };

  //unposted functionality
  const openUnposted=()=>{
    setIsUnpostedDialogOpen(true);
    console.log("isopen----",isUnpostedDialogOpen);
  };

  const closeUnposted=()=>{
    setIsUnpostedDialogOpen(false);
  };

  // Function to check if a field should be disabled
  const isFieldDisabled = (fieldName) => {
    if (!isSaved) {
      // If not saved, all fields are enabled
      return false;
    }
    
    if (isEditing) {
      // In edit mode, only the non-editable fields should be disabled
      return nonEditableFields.includes(fieldName);
    }
    
    // If saved but not editing, all fields are disabled
    return true;
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isSaved) {
      setIsEditing(!isEditing);
    } else {
      alert("Please search and select a user first to edit.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {

      const url = isEditing 
        ? `${API_BASE_URL}/update` 
        : `${API_BASE_URL}/register`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData), // Corrected
      });

      const result = await response.json();
      if (response.ok) {
        if (isEditing) {
          alert("User Updated Successfully!");
          setIsEditing(false);
        } else {
          alert("User Added Successfully!");
        }
        setIsSaved(true);
        console.log(result);
      } else {
        alert(isEditing ? "Error updating user!" : "Error saving user!");
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">User Master Entry</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Branch Code:</label>
          {/* <select name="branchCode" value={formData.branchCode} onChange={handleChange}>
        <option value="">Select Branch Code</option>
        {Array.isArray(branches) && branches.length > 0 ? (
    branches.map((branch) => (
      <option key={branch.branchCode } value={branch.branchCode}>
        {branch.branchCode}
      </option>
    ))
  ) : (
    <option disabled>Loading...</option>
  )}
      </select> */}
          <input
            type="text"
            name="branchCode"
            value={formData.branchCode}
            onChange={handleBranchCodeChange}
            onKeyDown={openBranchDialog}
            placeholder="Enter branch code"
            disabled={isFieldDisabled("branchCode")}
          />
          {/* <button type="button" onClick={openDialog}>Select Branch</button> */}

          <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} disabled />
        </div>

        

        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("name")} />
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("dob")} />
        </div>

        <div className="form-group">
          <label>Emp ID:</label>
          <input type="text" name="empId" value={formData.empId} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("empId")}  />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <textarea name="address" value={formData.address} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("address")} ></textarea>
        </div>

        <div className="form-group">
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("city")} />
          <label>Telephone No:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("phone")}/>
        </div>

        <div className="form-group">
          <label>User Identity:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("username")}/>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("password")}/>
        </div>

        <div className="form-group">
          <label>Level:</label>
          <select name="level" value={formData.level === "2" ? "operator" : "supervisor"}  onChange={handleChange} disabled={isFieldDisabled("level")}>
            <option value="operator">operator</option>
            <option value="supervisor">supervisor</option>
          </select>
          <label>Function Group No:</label>
          <input type="text" name="functionGroup" value={formData.functionGroup} onChange={handleChange} disabled={isFieldDisabled("functionGroup")}/>
        </div>

        {/* <div className="form-group">
          <label>From Amount:</label>
          <input type="number" name="fromAmount" value={formData.fromAmount} onChange={handleChange} />
          <label>To Amount:</label>
          <input type="number" name="toAmount" value={formData.toAmount} onChange={handleChange} />
        </div> */}

        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status === "1" ? "Working" : "Inactive"}  onChange={handleChange} disabled={isFieldDisabled("status")}>
            <option value="Working">Working</option>
            <option value="Inactive">Inactive</option>
          </select>
          <label>Closing Date:</label>
          <input type="date" name="closingDate" value={formData.closingDate} onChange={handleChange} disabled={isFieldDisabled("closingDate")}/>
        </div>

        <div className="form-group">
          <label>Period:</label>
          <input type="text" name="period" value={formData.period} onChange={handleChange} disabled={isFieldDisabled("period")}/>
        </div>

        <div className="form-group">
          <label>Expiry Date:</label>
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isFieldDisabled("expiryDate")}/>
        </div>

        {/* <div className="form-group checkbox-group">
          <input type="checkbox" name="hoOfficer" checked={formData.hoOfficer} onChange={handleChange} />
          <label>HO Officer</label>
          <input type="checkbox" name="mobileUser" checked={formData.mobileUser} onChange={handleChange} />
          <label>Mobile Appl. User</label>
        </div> */}

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancle}>
            Cancel
          </button>
          <button type="button" onClick={toggleEditMode}>{isEditing ? "Cancel Edit" : "Edit"} </button>
          <button type="button" onClick={openSearchDialog}>Search</button>
          <button type="button" onClick={exitform}>Exit</button>
          <button type="button" onClick={openUnposted}>Unposted</button>
          
        </div>
      </form>
      
      <SearchUserDialog
      isOpen={isSearchDialogOpen}
      onClose={closeSearchDialog}
      // onSearch={handleSearch}
      onBranchSearch={fetchBranches}
      onUserSelect={handleUserSelect}/>  

      {/* Branch LOV Dialog */}
      <BranchLovDialog
        isOpen={isBranchDialogOpen}
        onClose={closeBranchDialog}
        onSelect={handleBranchSelect}
        initialSearchValue={formData.branchCode}
      />
      
      <Unposted
      isOpen={isUnpostedDialogOpen}
      onClose={closeUnposted}/>
    </div>
  );
};

export default RegistrationForm;
