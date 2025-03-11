import React, { useState,useEffect  } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./registrationform.css";

const RegistrationForm = () => {

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
    level: "Customer",
    functionGroup: "",
    status: "Working",
    subLevel: "",
    exceptionPassword: "",
    role: "",
    closingDate: "",
    period: "",
    expiryDate: "",
    hoOfficer: false,
    mobileUser: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8182/v2/branch-codes")
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
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
    // setFormData({
    //   ...formData,
    //   [name]: type === "checkbox" ? checked : value,
    // });
  
    const openDialog = () => {
      setIsDialogOpen(true);
    };
  
    const closeDialog = () => {
      setIsDialogOpen(false);
    };
  
    const selectBranch = (branchCode, branchName) => {
      setFormData({ ...formData, branchCode, branchName });
      closeDialog();
    };

    const fetchBranches = (searchValue) => {
      fetch(`http://localhost:8182/v2/branch-codes?query=${searchValue}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedBranches = data.map((item) => {
            const [branchName, branchCode] = item.split(",");
            return { branchCode: branchCode.trim(), branchName: branchName.trim() };
          });
          setBranches(formattedBranches);
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
  
    

  const exitform=()=>{
    navigate("/mainpage");
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {
        const response = await fetch("http://localhost:8182/v2/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify(formData), // Corrected
        });
    
        const result = await response.json();
        if (response.ok) {
          alert("User Added Successfully!");
          
          console.log(result);
        //   navigate(result.redirect);
        } else {
          alert("error to save user!");
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
            onKeyDown={handleBranchCodeKeyDown}
            placeholder="Enter branch code"
          />
          {/* <button type="button" onClick={openDialog}>Select Branch</button> */}
          
          <input type="text"    name="branchName" value={formData.branchName} onChange={handleChange} disabled/>
        </div>

        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog-box">
              <h3>Select a Branch</h3>
              <table>
                <thead>
                  <tr>
                    <th>Branch Code</th>
                    <th>Branch Name</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.branchCode} onClick={() => selectBranch(branch.branchCode, branch.branchName)}>
                      <td>{branch.branchCode}</td>
                      <td>{branch.branchName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={closeDialog}>Close</button>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Name:</label>
          <input type="text"  name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Emp ID:</label>
          <input type="text" name="empId" value={formData.empId} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
          <label>Telephone No:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>User Identity:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Level:</label>
          <select name="level" value={formData.level} onChange={handleChange}>
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
          </select>
          <label>Function Group No:</label>
          <input type="text" name="functionGroup" value={formData.functionGroup} onChange={handleChange} />
        </div>

        {/* <div className="form-group">
          <label>From Amount:</label>
          <input type="number" name="fromAmount" value={formData.fromAmount} onChange={handleChange} />
          <label>To Amount:</label>
          <input type="number" name="toAmount" value={formData.toAmount} onChange={handleChange} />
        </div> */}

        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Working">Working</option>
            <option value="Inactive">Inactive</option>
          </select>
          <label>Closing Date:</label>
          <input type="date" name="closingDate" value={formData.closingDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Period:</label>
          <input type="text" name="period" value={formData.period} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Expiry Date:</label>
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
        </div>

        {/* <div className="form-group checkbox-group">
          <input type="checkbox" name="hoOfficer" checked={formData.hoOfficer} onChange={handleChange} />
          <label>HO Officer</label>
          <input type="checkbox" name="mobileUser" checked={formData.mobileUser} onChange={handleChange} />
          <label>Mobile Appl. User</label>
        </div> */}

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => setFormData({})}>
            Cancel
          </button>
          <button type="button">Search</button>
          <button type="button" onClick={exitform}>Exit</button>
          <button type="button">Unposted</button>
          <button type="button">Transfer</button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
