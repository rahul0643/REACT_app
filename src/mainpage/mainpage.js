import React, { useState,useEffect  } from "react";
import "./mainpage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log("Menu toggled:", isMenuOpen);
  };

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setCurrentDate(formattedDate.toUpperCase()); // Formats like "03-JAN-2023"
  }, []);

  
  const handleLogoff = () => {
    alert("Logging out...");
    // Redirect to login page logic here
    navigate("/static");
    
  };

  return (
    <div className="main-container">
    {/* Top Bar */}
    <div className="top-bar">
        <div className="hamburger-menu" onClick={toggleMenu}>
        ☰ Menu
      </div>
      <span>ASHTAVINAYAK NAGRI SAHKARI PAT SANSTHA MAR. BENODA,HO</span>
      <span>{currentDate}</span>
      <button style={{background:'black'}} onClick={handleLogoff}>Logoff</button>
    </div>

    {/* Sidebar */}
    <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <ul className="menu">
          {/* Masters and Transactions */}
          <li onClick={() => toggleSubMenu("masters")}>
            Masters and Transactions {openSubMenu === "masters" ? "▲" : "▼"}
            {openSubMenu === "masters" && (
              <ul className="submenu">
                <li><Link to="/register">User Master Entry</Link></li>
                <li><a href="/form2">Form 2</a></li>
              </ul>
            )}
          </li>

          {/* Reports */}
          <li onClick={() => toggleSubMenu("reports")}>
            Reports {openSubMenu === "reports" ? "▲" : "▼"}
            {openSubMenu === "reports" && (
              <ul className="submenu">
                <li onClick={() => toggleSubMenu("loan")}>
                  Loan {openSubMenu === "loan" ? "▲" : "▼"}
                  {openSubMenu === "loan" && (
                    <ul className="submenu nested">
                      <li><a href="/loan-notice">Loan Notice</a></li>
                      <li><a href="/loan-summary">Loan Summary</a></li>
                    </ul>
                  )}
                </li>
                <li><a href="/report1">Report 1</a></li>
              </ul>
            )}
          </li>
        </ul>
      </div>

    {/* Main Content */}
    <div className={`content ${isMenuOpen ? "shift" : ""}`}>
      <h2>Welcome to the Dashboard</h2>
    </div>

    {/* Footer */}
    <footer>
      <p>Developed by Netwin Systems & Software (I) Pvt. Ltd.</p>
    </footer>
  </div>
  );
};

export default MainPage;

// <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
// <div className="hamburger-menu" onClick={toggleMenu}>
//   ☰ Menu
// </div>
// <ul className="menu">
//   <li>Masters and Transactions</li>
//   <li>Reports</li>
// </ul>
// </div>
