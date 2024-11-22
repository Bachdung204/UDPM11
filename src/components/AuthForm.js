import React, { useState } from 'react';
import axios from 'axios';
import { apiKey } from '../api'; // Đảm bảo apiKey của bạn đã được khai báo đúng

const apiUrl = "https://api.gameshift.dev/nx/users"; // URL API GameShift

const AuthForm = ({ setIsLoggedIn, setUserData }) => {
  const [email, setEmail] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Trạng thái đăng ký
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true); // Trạng thái hiển thị form

  // Xóa dữ liệu khi chuyển form
  const handleSwitchForm = () => {
    setIsRegistering(!isRegistering);
    setEmail(''); // Xóa email khi chuyển form
    setReferenceId(''); // Xóa referenceId khi chuyển form
    setErrorMessage(''); // Xóa thông báo lỗi
    setSuccessMessage(''); // Xóa thông báo thành công
  };

  // Đăng ký tài khoản
  const handleRegister = async () => {
    if (!referenceId || !email) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const response = await axios.post(apiUrl, { referenceId, email }, {
        headers: { "x-api-key": apiKey }
      });

      if (response.status === 201) {
        // Kiểm tra nếu mã trạng thái là 201 và trả về JSON thành công
        setIsLoggedIn(true);
        setUserData({ referenceId, email });
        setSuccessMessage('Đăng ký thành công!');
        setIsFormVisible(false); // Ẩn form đăng ký sau khi thành công
      } else {
        setErrorMessage('Đã xảy ra lỗi trong quá trình đăng ký.');
      }
    } catch (err) {
      if (err.response) {
        // Kiểm tra lỗi trùng email hoặc referenceId
        if (err.response.status === 409) {
          if (err.response.data.message.includes('email')) {
            setErrorMessage('Email đã được sử dụng. Vui lòng chọn email khác.');
          } else if (err.response.data.message.includes('referenceId')) {
            setErrorMessage('ReferenceId đã tồn tại. Vui lòng chọn referenceId khác.');
          }
        } else {
          setErrorMessage('Đã xảy ra lỗi trong quá trình đăng ký.');
        }
      } else {
        // Xử lý lỗi không có phản hồi từ server
        setErrorMessage('Đã xảy ra lỗi trong quá trình đăng ký.');
      }
    }
  };

  // Đăng nhập tài khoản
  const handleLogin = async () => {
    if (!referenceId || !email) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    try {
      const response = await axios.get(apiUrl, {
        params: { referenceId, email },
        headers: { "x-api-key": apiKey }
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        setUserData({ referenceId, email });
        setSuccessMessage('Đăng nhập thành công!');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrorMessage('Tài khoản không tồn tại hoặc thông tin không chính xác.');
      } else {
        console.error("Lỗi đăng nhập", err);
        setErrorMessage('Đã xảy ra lỗi trong quá trình đăng nhập.');
      }
    }
  };

  return (
    <div className="auth-container">
      {isFormVisible && (isRegistering ? (
        // Form đăng ký
        <div className="register-form">
          <h3 style={{ color: '#28a745' }}>Đăng ký tài khoản</h3>
          <p>Vui lòng điền thông tin để tạo tài khoản mới.</p>
          <input 
            type="text" 
            placeholder="Nhập referenceId" 
            value={referenceId} 
            onChange={(e) => setReferenceId(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Nhập email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <button onClick={handleRegister}>Đăng ký</button>
        </div>
      ) : (
        // Form đăng nhập
        <div className="login-form">
          <h3 style={{ color: '#007bff' }}>Đăng nhập</h3>
          <p>Nhập thông tin tài khoản để đăng nhập.</p>
          <input 
            type="text" 
            placeholder="Nhập referenceId" 
            value={referenceId} 
            onChange={(e) => setReferenceId(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Nhập email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <button onClick={handleLogin}>Đăng nhập</button>
        </div>
      ))}

      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

      <p>
        {isFormVisible && (isRegistering ? "Đã có tài khoản?" : "Chưa có tài khoản?")}
        {isFormVisible && (
          <button 
            onClick={handleSwitchForm} 
            style={{ color: '#007bff', fontWeight: 'bold' }} >
            {isRegistering ? "Đăng nhập" : "Đăng ký"}
          </button>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
