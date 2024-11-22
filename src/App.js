import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import MyNfts from "./components/MyNfts";
import UserDashboard from "./components/User"; // Trang người dùng
import AuthForm from "./components/AuthForm";
import * as web3 from "@solana/web3.js";
import solanaLogo from './sol.png'; // Đường dẫn tới logo Solana Superteam
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [address, setAddress] = useState(""); // Địa chỉ ví
  const [balance, setBalance] = useState(0); // Số dư ví
  const [isHovered, setIsHovered] = useState(false); // Kiểm tra khi di chuột vào
  const navigate = useNavigate();

  const getProvider = () => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    window.open("https://phantom.app/", "_blank");
  };

  const onConnect = async () => {
    const provider = getProvider();
    try {
      const resp = await provider.connect();
      const publicKey = resp.publicKey.toString();
      setAddress(publicKey);

      const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
      const solBalance = await connection.getBalance(resp.publicKey) / Math.pow(10, 9);
      setBalance(solBalance);

      navigate("/home");
    } catch (err) {
      console.error("Kết nối thất bại:", err);
    }
  };

  const onDisconnectWallet = () => {
    setAddress("");
    setBalance(0);
  };

  const onLogout = () => {
    setAddress("");
    setBalance(0);
    setUserData(null);
    setIsLoggedIn(false);
    navigate("/"); // Quay về trang chủ
  };

  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn && (
          <div className="header-container">
            <div className="header-left">
              <NavLink to="/home">
                <img src={solanaLogo} alt="Solana Logo" className="logo" />
              </NavLink>
              <nav className="menu">
                <NavLink to="/home" className="menu-item" activeClassName="active">Trang chủ</NavLink>
                <NavLink to="/my-nfts" className="menu-item" activeClassName="active">Các NFT của tôi</NavLink>
                <NavLink to="/user" className="menu-item" activeClassName="active">Người dùng</NavLink>
              </nav>
            </div>

            <div className="header-right">
              {address ? (
                <div
                  className="wallet-info-container"
                  onMouseEnter={() => setIsHovered(true)}  // Khi di chuột vào
                  onMouseLeave={() => setIsHovered(false)} // Khi di chuột ra
                >
                  <button
                    className="disconnect-wallet"
                    onClick={onDisconnectWallet}
                  >
                    Dừng kết nối ví
                  </button>

                  {/* Hiển thị thông tin ví khi hover */}
                  {isHovered && address && (
                    <div className="wallet-info">
                      <p>Địa chỉ ví: {address.slice(0, 6)}...{address.slice(-4)}</p>
                      <p>Số dư: {balance.toFixed(2)} SOL</p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="connect-wallet"
                  onClick={onConnect}
                >
                  Kết nối ví Phantom
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {!isLoggedIn ? (
          <AuthForm 
            setIsLoggedIn={setIsLoggedIn}
            setUserData={setUserData}
          />
        ) : (
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/my-nfts" element={<MyNfts referenceId={userData?.referenceId} />} />
            <Route path="/user" element={<UserDashboard userData={userData} />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
