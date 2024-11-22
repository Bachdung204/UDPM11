// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import MyNfts from "./components/MyNfts";
import User from "./components/User";
import AuthForm from "./components/AuthForm";
import { apiKey } from './api'; 
import axios from 'axios';
import './App.css';

const apiUrl = "https://api.gameshift.dev/nx/users";

function App() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {!isLoggedIn ? (
            <AuthForm 
              setIsLoggedIn={setIsLoggedIn}
              setUserData={setUserData}
            />
          ) : (
            <div>
              <h3>Chào mừng {userData?.email}</h3>
              <nav>
                <Link to="/home">Trang chủ</Link> | 
                <Link to="/my-nfts">Các NFT của tôi</Link> | 
                <Link to="/user">Người dùng</Link>
              </nav>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/my-nfts" element={<MyNfts referenceId={userData?.referenceId} />} />
                <Route 
                  path="/user" 
                  element={
                    <User 
                      referenceId={userData?.referenceId}
                      email={userData?.email}
                    />
                  } 
                />
              </Routes>
            </div>
          )}
        </header>
      </div>
    </Router>
  );
}

export default App;