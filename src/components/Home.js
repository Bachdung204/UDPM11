import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiKey } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
    try {
      const response = await axios.get("https://api.gameshift.dev/nx/nfts", {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
      });
      if (response.data) {
        setNfts(response.data);
      }
    } catch (err) {
      console.error("Không thể lấy dữ liệu NFT", err);
    }
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Bộ Sưu Tập NFT</h1>
        <p className="text-muted">
          Khám phá bộ sưu tập các tác phẩm NFT trên nền tảng Solana.
        </p>
      </header>
      {nfts && nfts.length > 0 ? (
        <div className="row g-4">
          {nfts.map((nft) => (
            <div key={nft.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-lg">
                <img
                  src={nft.image || "https://via.placeholder.com/300"}
                  className="card-img-top rounded-top"
                  alt={nft.name}
                  style={{ objectFit: "cover", height: "250px" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{nft.name}</h5>
                  <p className="card-text text-muted">
                    Giá: <span className="fw-bold">{nft.price} SOL</span>
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 text-center">
                  <button className="btn btn-outline-primary">
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <p className="fs-5 text-secondary">Không có NFT nào.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
