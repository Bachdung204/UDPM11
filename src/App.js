import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./components/Home";
import MyNfts from "./components/MyNfts";
import User from "./components/User";
import AuthForm from "./components/AuthForm";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const isPhantomInstalled = window.phantom?.solana?.isPhantom;
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletStatus, setWalletStatus] = useState('');

  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    window.open('https://phantom.app/', '_blank');
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) {
      setWalletStatus('Phantom chưa được cài đặt.');
      return;
    }

    try {
      const resp = await provider.connect();
      console.log('PublicKey:', resp.publicKey.toString());
      setWalletStatus(`Kết nối thành công! PublicKey: ${resp.publicKey.toString()}`);
    } catch (err) {
      console.error(err);
      setWalletStatus('Lỗi khi kết nối ví: ' + err.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
              <Link className="navbar-brand" to="/home">NFT App</Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  {!isLoggedIn ? (
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Đăng nhập</Link>
                    </li>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/home">Trang chủ</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/my-nfts">Các NFT của tôi</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user">Người dùng</Link>
                      </li>
                      <li className="nav-item">
                        <span className="nav-link">
                          {isPhantomInstalled ? 'Phantom đã cài đặt' : 'Phantom chưa cài đặt'}
                        </span>
                      </li>
                      <li className="nav-item">
                        <button className="btn btn-light" onClick={connectWallet}>Connect</button>
                      </li>
                      <li className="nav-item">
                        <span className="nav-link">{walletStatus}</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>

          <div className="container mt-5">
            {!isLoggedIn ? (
              <AuthForm
                setIsLoggedIn={setIsLoggedIn}
                setUserData={setUserData}
              />
            ) : (
              <div>
                <h3 className="text-center">Chào mừng {userData?.email}</h3>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
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
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
