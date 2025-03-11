import logo from './logo.svg';
import './App.css';
import './login.js'
import Login from './login.js';
import MainPage from './mainpage/mainpage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from './registrationform/registrationform';
import PasswordReset from './Resetpass/passwordreset';

function App() {
  return (
    <div className="App">
      {/* <Login/> */}
      {/* <MainPage/> */}
      {/* <RegistrationForm/> */}
      {/* <PasswordReset/> */}
      <Router >
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/reset-password" element={<PasswordReset/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
