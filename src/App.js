import logo from './logo.svg';
import './App.css';
import './login.js'
import Login from './login.js';
import MainPage from './mainpage/mainpage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './registrationform/registrationform';
import PasswordReset from './Resetpass/passwordreset';
import SearchUserDialog from './registrationform/searchuserdialog';
import BranchLovDialog from './registrationform/branchlovdialog';
import Unposted from './registrationform/unposted';
import CbsRegistration from './cbsregistration/cbsregistration';
import VndrRegistration from './vendorregistration/vndrregistration';
import ApiManagementForm from './apimanager/apimanagementform';

function App() {
  return (
    <div className="App">
      {/* <Login/> */}
      {/* <MainPage/> */}
      {/* <RegistrationForm/> */}
      {/* <PasswordReset/> */}
      <Router basename='/root' >
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/reset-password" element={<PasswordReset/>} />
                <Route path="/branch-lov" element={<BranchLovDialog/>} />
                <Route path="/cbs-reg" element={<CbsRegistration/>} />
                <Route path="/vendor-reg" element={<VndrRegistration/>} />
                <Route path="/api-manager" element={<ApiManagementForm/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
