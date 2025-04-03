import React, { useState, useEffect } from "react";
import "./registrationform.css";

const BranchLovDialog = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  initialSearchValue = "" 
}) => {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // 3 items per page as requested
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";

//   http://localhost:8182/loginv2-0.0.1-SNAPSHOT/v2

  useEffect(() => {
    if (isOpen) {
      fetchBranches(initialSearchValue);
    }
  }, [isOpen, initialSearchValue]);

  const fetchBranches = (query = "") => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/branch-codes?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedBranches = data.map((item) => {
          const [branchName, branchCode] = item.split(",");
          return { branchCode: branchCode.trim(), branchName: branchName.trim() };
        });
        setBranches(formattedBranches);
        setCurrentPage(1); // Reset to first page when fetching new branches
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching branch codes:", error);
        setBranches([]);
        setIsLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBranches(searchValue);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Select a Branch</h3>
        
        {/* Search box */}
        {/* <div className="branch-search">
          <input 
            type="text" 
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search branches..."
          />
          
        </div> */}
        
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Branch Code</th>
                  <th>Branch Name</th>
                </tr>
              </thead>
              <tbody>
                {branches.length > 0 ? (
                  branches
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((branch) => (
                      <tr 
                        key={branch.branchCode} 
                        onClick={() => onSelect(branch.branchCode, branch.branchName)}
                        className="branch-row"
                      >
                        <td>{branch.branchCode}</td>
                        <td>{branch.branchName}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="2" className="no-data">No branches found</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination Controls with Icons */}
            {branches.length > 0 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                  className="icon-button"
                >
                  <span className="pagination-icon">&#8592;</span>
                </button>
                <span> Page {currentPage} of {Math.ceil(branches.length / itemsPerPage)} </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(branches.length / itemsPerPage)))} 
                  disabled={currentPage >= Math.ceil(branches.length / itemsPerPage)}
                  className="icon-button"
                >
                  <span className="pagination-icon">&#8594;</span>
                </button>
              </div>
            )}
          </>
        )}
        
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default BranchLovDialog;