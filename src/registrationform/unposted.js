import React, { useState,useEffect } from 'react';
import './unposted.css'; // You'll need to create this CSS file

const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";


const Unposted = ({ isOpen, onClose, onUnpost, onUserSelect }) => {
  const [users, setUsers] = useState([
    // Initial empty rows
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
    { userId: '', name: '', post: false, delete: false },
  ]);
  
  const [unpostedRecords, setUnpostedRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  const handleInputChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], [field]: value };
    setUsers(updatedUsers);
  };

  useEffect(() => {
    if (isOpen) {
        fetchUnpostedRecords();
    }
  }, [isOpen]);

  const fillgrid = (userData) => {
    // Populate the form with the selected user data
    console.log("user data-----",userData.user_id);
    setUsers({
      userId: userData.user_id || "",
      name: userData.NAME || "",
      post:0 ||"",
      delete:false

    });
    
  };

  const handlePostSelected = async () => {
    const selectedUsers = users.filter(user => user.post); // Get selected records
    console.log("selected for posting",JSON.stringify(selectedUsers));
    if (selectedUsers.length === 0) {
      alert("No records selected for posting.");
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/postRecords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUsers), // Sending selected records
      });
      console.log("data unpost---",JSON.stringify(selectedUsers));
      const result = await response.json();
      console.log("Post response:", result);
  
      if (response.ok) {
        alert("Selected records posted successfully!");
  
        // Remove posted records from users state
        setUsers(prevUsers => prevUsers.filter(user => !user.post));
      } else {
        alert("Failed to post records.");
      }
    } catch (error) {
      console.error("Error posting records:", error);
      alert("An error occurred while posting.");
    }
  };
  

const fetchUnpostedRecords = () => {
    setIsLoading(true);
    fetch("http://localhost:8182/loginv2-0.0.1-SNAPSHOT/v2/unposted")
      .then((response) => response.json())
      .then((data) => {
        console.log("unposted---->",data);
       // setUnpostedRecords(data);
       // fillgrid(data);
       if (Array.isArray(data)) {
        setUsers(
          data.map((item) => ({
            userId: item.user_id || '',
            name: item.NAME || '',
           
          }))
        );
      } else {
        console.error("Unexpected data format:", data);
        setUsers([]); // Ensure it's always an array
      }
        setCurrentPage(1); // Reset to first page when fetching new records
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching unposted records:", error);
        setUnpostedRecords([]);
        setIsLoading(false);
      });
  };

  const handleDelete = () => {
    const filteredUsers = users.filter(user => !user.delete);
    setUsers(filteredUsers);
  };

  const handleCancel = () => {
    // Reset the form
    setUsers(users.map(user => ({ userId: '', name: '', post: false, delete: false })));
  };

   // Pagination logic
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
 
   const totalPages = Math.ceil(users.length / itemsPerPage);

  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="form-container">
          <div className="form-header">
            User Master Posting
          </div>
          
          <div className="table-container">
            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User Id</th>
                    <th>Name</th>
                    <th>Post</th>
                    {/* <th>Delete</th> */}
                  </tr>
                </thead>
                <tbody>
                {currentUsers.map((users, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={users.userId}
                          onChange={(e) => handleInputChange(indexOfFirstItem + index, 'userId', e.target.value)}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={users.name}
                          onChange={(e) => handleInputChange(indexOfFirstItem + index, 'name', e.target.value)}
                          disabled={true}
                        />
                      </td>
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={users.post}
                          onChange={(e) => handleInputChange(indexOfFirstItem + index, 'post', e.target.checked)}
                        />
                      </td>
                      {/* <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          checked={users.delete}
                          onChange={(e) => handleInputChange(indexOfFirstItem + index, 'delete', e.target.checked)}
                        />
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
           {/* Pagination Controls */}
           {users.length > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="icon-button"
              >
                <span className="pagination-icon">&#8592;</span>
              </button>
              <span> Page {currentPage} of {totalPages} </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage >= totalPages}
                className="icon-button"
              >
                <span className="pagination-icon">&#8594;</span>
              </button>
            </div>
          )}
          
          <div className="button-group">
            <button onClick={handlePostSelected} className="action-button">Post</button>
            {/* <button onClick={handleDelete} className="action-button">Delete</button> */}
            {/* <button onClick={handleCancel} className="action-button">Cancel</button> */}
            <button onClick={onClose} className="action-button">Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unposted;