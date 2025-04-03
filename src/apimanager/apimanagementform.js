import React, { useState ,useEffect} from 'react';
import styles from './apimanagement.module.css';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = window.runtimeConfig?.API_BASE_URL || "/v2";


const ApiManagementForm = () => {
  // Sample data for dropdowns
  const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedVendor, setSelectedVendor] = useState('');
    const [loading, setLoading] = useState(false);
    const [clientSrno, setClientSrno] = useState(''); // Hidden field state
    const [vndrSrno, setVndrSrno] = useState(''); // Hidden field state
    const [apiDetails, setApiDetails] = useState([]); // State for API details
    const [statusMessage, setStatusMessage] = useState(''); // For success/error messages
    const [actionLoading, setActionLoading] = useState(null); // Track which API is being updated

     // Pagination states
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage] = useState(3);
   
  const navigate=useNavigate();

  const exitform=()=>{
    navigate("/mainpage");
  }

  const [vendors,setVendors] = useState([]);

  // Sample API list with additional details
  

  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    setSelectedClient(selectedId);
    console.log("selected client id---"+selectedId);
    // Find the corresponding clientSrno
    const client = clients.find(client => client.clientId === selectedId);
    if (client) {
      setClientSrno(client.clientSrno);
    }
  };
  

  const handleVendorChange = (e) => {
    const selectedId = e.target.value;
    setSelectedVendor(selectedId);
    console.log("selected vendor id---"+selectedId);
    // Find the corresponding clientSrno
    const vendor = vendors.find(vendor => vendor.vndrId === selectedId);
    if (vendor) {
      setVndrSrno(vendor.vndrSrno);
    }
    console.log("vendor-srno----"+vendor.vndrSrno);
  };
  
  // State for API active/inactive status
  const [apiStatus, setApiStatus] = useState(
    
  );

  useEffect(() => {
    // Fetch clients when component mounts
    fetchClients();
    // Calculate total pages
  }, []);

  useEffect(() => {
    if (selectedClient) {
        fetchVendors(); // Fetch vendors when a client is selected
    }
}, [selectedClient]); 

   // Get current items for the page
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = apiDetails.slice(indexOfFirstItem, indexOfLastItem);
   
   // Calculate total pages
   const totalPages = Math.ceil(apiDetails.length / itemsPerPage);



  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/get-client`);
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
    //   const data=JSON.stringify(data_og, null, 2);
       console.log("Fetched Clients:",data);
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors=async()=>{
    try {
        const requestBody = { clientId: selectedClient.clientId };
        console.log("requestBody----"+JSON.stringify({ clientId: selectedClient }));
        console.log("clientsrno----"+clientSrno);
        const response = await fetch(`${API_BASE_URL}/get-vendors`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ clientId: selectedClient }), // Corrected
          }); 
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }
        const data = await response.json();
      //   const data=JSON.stringify(data_og, null, 2);
         console.log("Fetched vendors:",data);
         setVendors(data);
       
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
  }



 // Update the showbtnclick function to properly initialize apiStatus from the response
const showbtnclick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestBody = { clientsrno: clientSrno, vndrsrno: vndrSrno };
      console.log("inside showbtn requestBody----"+JSON.stringify(requestBody));
      
      const response = await fetch(`${API_BASE_URL}/get-apiDet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }); 
      
      if (!response.ok) {
        throw new Error('Failed to fetch api details');
      }
      
      const data = await response.json();
      console.log("Fetched api details:", data);
      
      // Initialize API status for each API based on is_active value
      const initialStatus = {};
      data.forEach((api) => {
        initialStatus[api.ntwapiversrno] = api.is_active === "1"; // Set true if "1", false if "0"
      });
      
      setApiStatus(initialStatus);
      setApiDetails(data);
    } catch (error) {
      console.error('Error fetching api details:', error);
    } finally {
      setLoading(false);
    }
  }

  // Handler to toggle API status
  const toggleApiStatus = async (api) => {
    setActionLoading(api.ntwapiversrno); // Set loading state for this specific API
    setStatusMessage('');
    
    try {
      const currentStatus = apiStatus[api.ntwapiversrno];
      const newStatus = !currentStatus;
      const activationValue = newStatus ? '1' : '0';
      
      const requestBody = {
        ntwapiversrno: api.ntwapiversrno.toString(),
        activation: activationValue
      };
      
      console.log("Sending activation request:", requestBody);
      
      const response = await fetch(`${API_BASE_URL}/update-apidet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update API status');
      }
      
      const data = await response.text();
      console.log("API status update response:", data);
      alert(data);
      
      // Update the local state with the new status
      setApiStatus(prevStatus => ({
        ...prevStatus,
        [api.ntwapiversrno]: newStatus
      }));
      
      setStatusMessage(`API ${api.ntwapiversrno} has been ${newStatus ? 'activated' : 'deactivated'} successfully.`);
    } catch (error) {
      console.error('Error updating API status:', error);
      setStatusMessage(`Failed to ${apiStatus[api.ntwapiversrno] ? 'deactivate' : 'activate'} API. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };


  return (
    <div className={styles.apiManagementContainer}>
      <h4 className={styles.pageTitle}>API Management Dashboard</h4>
        
      <div className={styles.dropdownSection}>
        <div className={styles.dropdownWrapper}>
          {/* <label htmlFor="client-select">Select Client</label> */}
          <select 
            id="client-select"
            value={selectedClient}
            onChange={handleClientChange}
            className={styles.select}
          >
            <option value="">Choose a client</option>
            {clients.map((client) => (
                
              <option key={client.clientId} value={client.clientId}>
                {client.clientName}
              </option>
            ))}
            
          </select>
          <input type="hidden" value={clientSrno} id="clientSrno" />
        </div>

        <div className={styles.dropdownWrapper}>
          {/* <label htmlFor="vendor-select">Select Vendor</label> */}
          <select 
            id="vendor-select"
            value={selectedVendor}
            onChange={handleVendorChange}
            className={styles.select}
          >
            <option value="">Choose a vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.vndrId} value={vendor.vndrId}>
                {vendor.vndrName}
              </option>
            ))}
          </select>
          <input type="hidden" value={vndrSrno} id="vndrSrno" />
        </div>
        <button type="button" className="submit_btn" onClick={showbtnclick} >show</button>
          <button type="button" className="submit_btn" onClick={exitform} >Exit</button>
       
      </div>

      <div className={styles.apiGrid}>
        <div className={styles.apiGridHeader}>
          <div className={styles.apiName}>API Name</div>
          <div className={styles.apiUrl}>API URL</div>
          <div className={styles.apiPermission}>Required Permission</div>
          <div className={styles.apiStatus}>Status</div>
          <div className={styles.apiAction}>Action</div>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            {currentItems.length > 0 ? (
  currentItems.map((api, index) => (
    <div key={index} className={styles.apiGridRow}>
      <div className={styles.apiName}>API {api.ntwapiversrno || index + 1}</div>
      <div className={styles.apiUrl}>{api.ntwapiurl || 'N/A'}</div>
      <div className={styles.apiVersion}>{api.ntwapiversrno || 'N/A'}</div>
      <div className={`${styles.apiStatus} ${apiStatus[api.ntwapiversrno] ? styles.active : styles.inactive}`}>
        {apiStatus[api.ntwapiversrno] ? 'Active' : 'Inactive'}
      </div>
      <div className={styles.apiAction}>
        {actionLoading === api.ntwapiversrno ? (
          <span className={styles.buttonLoading}>Processing...</span>
        ) : (
          <button 
            className={`${styles.toggleButton} ${apiStatus[api.ntwapiversrno] ? styles.active : styles.inactive}`}
            onClick={() => toggleApiStatus(api)}
          >
            {apiStatus[api.ntwapiversrno] ? 'Deactivate' : 'Activate'}
          </button>
        )}
      </div>
    </div>
  ))
) : (
  !loading && apiDetails.length === 0 && selectedClient && selectedVendor && (
    <div className={styles.noData}>No API details found for the selected client and vendor.</div>
  )
)}
          </>
        )}
      </div>
      
      {/* Pagination Controls like in BranchLovDialog */}
      {apiDetails.length > 0 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
            className={styles.iconButton}
          >
            <span className={styles.paginationIcon}>&#8592;</span>
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage >= totalPages}
            className={styles.iconButton}
          >
            <span className={styles.paginationIcon}>&#8594;</span>
          </button>
        </div>
      )}
      
    </div>
  );
};

export default ApiManagementForm;