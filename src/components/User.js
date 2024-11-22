import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiKey } from '../api';  // Đảm bảo apiKey của bạn đã được cung cấp đúng

const User = ({ userData }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        // Reset states trước khi gọi API
        setLoading(true);
        setError(null);

        const response = await axios.get(`https://api.gameshift.dev/nx/nfts/${userData.referenceId}`, {
          headers: {
            "x-api-key": apiKey,
          },
        });
        setNfts(response.data); // Cập nhật danh sách NFT
      } catch (err) {
        console.error("Lỗi tải NFT", err);
        setError('Không thể tải thông tin NFT. Vui lòng thử lại sau.');
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    if (userData?.referenceId) {
      fetchNfts();
    } else {
      setLoading(false); // Nếu không có referenceId, dừng loading
    }
  }, [userData]);

  return (
    <div className="user-dashboard">
      <h3>Thông tin người dùng</h3>
      <p>Email: {userData.email}</p>
      <p>Reference ID: {userData.referenceId}</p>

      <h4>Các NFT của bạn</h4>

      {loading && <p>Đang tải dữ liệu...</p>} {/* Hiển thị loading */}
      
      {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi */}

      {!loading && !error && nfts.length === 0 && <p>Chưa có NFT nào.</p>} {/* Khi không có NFT */}

      {nfts.length > 0 && (
        <div className="nft-list">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-item">
              <p><strong>{nft.name}</strong></p>
              <p>Giá: {nft.price} SOL</p>
              <img src={nft.imageUrl} alt={nft.name} className="nft-image" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default User;
