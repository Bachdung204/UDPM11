// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import MyNfts from "./components/MyNfts";
import User from "./components/User";
import AuthForm from "./components/AuthForm"; // Thêm AuthForm component
import { apiKey } from './api'; 
import axios from 'axios';
import './App.css';  // Đảm bảo import đúng

const apiUrl = "https://api.gameshift.dev/nx/users";

function App() {
  const [referenceId, setReferenceId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterLogin = async (referenceId, email, isRegistering) => {
    const requestData = { referenceId, email };
    try {
      await axios.post(apiUrl, requestData, {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
      });
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Đăng nhập/Đăng ký thất bại", err);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {!isLoggedIn ? (
            <AuthForm handleRegisterLogin={handleRegisterLogin} isRegistering={isRegistering} setIsRegistering={setIsRegistering} />
          ) : (
            <div>
              <h3>Chào mừng {email}</h3>
              <nav>
                <Link to="/home">Trang chủ</Link> | 
                <Link to="/my-nfts">Các NFT của tôi</Link> | 
                <Link to="/user">Người dùng</Link>
              </nav>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/my-nfts" element={<MyNfts referenceId={referenceId} />} />
                <Route path="/user" element={<User referenceId={referenceId} email={email} address={address} setAddress={setAddress} setBalance={setBalance} />} />
              </Routes>
            </div>
          )}
        </header>
      </div>
    </Router>
  );
}

export default App;
