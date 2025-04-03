import React, { useState ,useEffect} from "react";
import "./registrationform.css";
import BranchLovDialog from "./branchlovdialog";

// http://localhost:8182/loginv2-0.0.1-SNAPSHOT/v2

const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";

const SearchUserDialog = ({ isOpen, onClose, onSearch, onUserSelect }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    branchCode: "",
    username: ""
  });
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const openBranchDialog = (e) => {
    if (e.key === "Tab") {
        e.preventDefault();
      setIsBranchDialogOpen(true);
      }
  };

  useEffect(() => {
    if (isOpen) {
      setSearchCriteria({ branchCode: "", username: "" });
    }
  }, [isOpen]);

  const closeBranchDialog = () => {
    setIsBranchDialogOpen(false);
  };

  const handleBranchSelect = (branchCode, branchName) => {
    setSearchCriteria({
      ...searchCriteria,
      branchCode,
      branchName
    });
    closeBranchDialog();
  };


  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'username') {
        newValue = value.toUpperCase();
        e.target.value = newValue; 
      }
    setSearchCriteria({
      ...searchCriteria,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //onSearch(searchCriteria);
    console.log(searchCriteria);
    try {
        const response = await fetch(`${API_BASE_URL}/search-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify(searchCriteria), // Corrected
        });
        //console.log(result);
        const result = await response.text();
        console.log(result);
        if (response.ok) {
          console.log("ok response");
          console.log(result);
          
          if(result==""){
            alert("no such user found!!");
          }else{
            const data=JSON.parse(result);
            console.log("result[0]----",data[0]);
            onUserSelect(data[0]);
            onClose();
            
          }
          
          //   navigate(result.redirect);
        } else {
          alert("error to search user!");
          console.error("Error:", result);
          
        }
      } catch (error) {
        console.error("Error:", error);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box search-dialog">
        <h3>Search User</h3>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-form-group">
            <label>Branch Code:</label>
            <input
              type="text"
              name="branchCode"
              value={searchCriteria.branchCode}
              onChange={handleSearchInputChange}
              onKeyDown={openBranchDialog}
              placeholder="Enter branch code"
            />
            {/* <button 
              type="button" 
              onClick={openBranchDialog}
              className="icon-button search-help-button"
            >
              <span>&#128269;</span>
            </button> */}
            {/* <button 
              type="button" 
              onClick={() => onBranchSearch(searchCriteria.branchCode)}
              className="icon-button search-help-button"
            >
              <span>&#128269;</span>
            </button> */}
          </div>
          <div className="search-form-group">
            <label>User ID:</label>
            <input
              type="text"
              name="username"
              value={searchCriteria.username}
              onChange={handleSearchInputChange}
              placeholder="Enter user ID"
            />
          </div>
          <div className="search-buttons">
            <button type="submit">Search</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
        {/* Branch LOV Dialog */}
        <BranchLovDialog
          isOpen={isBranchDialogOpen}
          onClose={closeBranchDialog}
          onSelect={handleBranchSelect}
          initialSearchValue={searchCriteria.branchCode}
        />
      </div>
    </div>
  );
};

export default SearchUserDialog;