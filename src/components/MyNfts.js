// src/components/MyNfts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiKey } from '../api'; 
import '../App.css';  // Đảm bảo import đúng

const MyNfts = ({ referenceId }) => {
  const [myNfts, setMyNfts] = useState([]);

  useEffect(() => {
    if (referenceId) {
      fetchMyNfts();
    }
  }, [referenceId]);

  const fetchMyNfts = async () => {
    try {
      const response = await axios.get(`https://api.gameshift.dev/nx/nfts/${referenceId}`, {
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
      });
      if (response.data) {
        setMyNfts(response.data);
      }
    } catch (err) {
      console.error("Không thể lấy dữ liệu NFT của tôi", err);
    }
  };

  return (
    <div>
      <h3>Các NFT của tôi</h3>
      {myNfts && myNfts.length > 0 ? (
        myNfts.map((nft) => (
          <div key={nft.id}>
            <p>{nft.name}</p>
            <p>Giá: {nft.price} SOL</p>
          </div>
        ))
      ) : (
        <p>Không có NFT nào</p>
      )}
      <button>Đăng bán NFT mới</button>
    </div>
  );
};

export default MyNfts;
