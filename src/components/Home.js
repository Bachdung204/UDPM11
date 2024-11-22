// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiKey } from '../api'; 
import '../App.css';  // Đảm bảo import đúng

const Home = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
    try {
      const response = await axios.get("https://api.gameshift.dev/nx/nfts", {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
      });
      if (response.data) {
        setNfts(response.data); // Ensure response.data is valid
      }
    } catch (err) {
      console.error("Không thể lấy dữ liệu NFT", err);
    }
  };

  return (
    <div>
      <h3>Trang chủ</h3>
      {nfts && nfts.length > 0 ? (
        nfts.map((nft) => (
          <div key={nft.id}>
            <p>{nft.name}</p>
            <p>Giá: {nft.price} SOL</p>
          </div>
        ))
      ) : (
        <p>Không có NFT nào</p>
      )}
    </div>
  );
};

export default Home;
