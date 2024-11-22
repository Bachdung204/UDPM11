import React, { useState } from 'react';
import axios from 'axios';
import { apiKey } from '../api';

const apiUrl = "https://api.gameshift.dev/nx/users";

const AuthForm = ({ setIsLoggedIn, setUserData }) => {
  const [formData, setFormData] = useState({
    email: '',
    referenceId: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    if (!formData.referenceId || !formData.email) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin.');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage('Email không hợp lệ.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: { 
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (response.data) {
        setSuccessMessage('Đăng ký thành công!');
        setTimeout(() => {
          setUserData(formData);  // First update userData
          setIsLoggedIn(true);    // Then update login state
          setIsFormVisible(false);
        }, 1500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        switch (err.response.status) {
          case 409:
            if (err.response.data.message?.includes('email')) {
              setErrorMessage('Email đã được sử dụng. Vui lòng chọn email khác.');
            } else if (err.response.data.message?.includes('referenceId')) {
              setErrorMessage('ReferenceId đã tồn tại. Vui lòng chọn referenceId khác.');
            } else {
              setErrorMessage('Tài khoản đã tồn tại trong hệ thống.');
            }
            break;
          case 400:
            setErrorMessage('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
            break;
          case 403:
            setErrorMessage('Không có quyền thực hiện thao tác này.');
            break;
          default:
            setErrorMessage('Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại sau.');
        }
      } else if (err.request) {
        setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setErrorMessage('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.get(apiUrl, {
        params: formData,
        headers: { 
          "x-api-key": apiKey 
        }
      });

      if (response.data) {
        setSuccessMessage('Đăng nhập thành công!');
        setTimeout(() => {
          setUserData(formData);  // First update userData
          setIsLoggedIn(true);    // Then update login state
        }, 1500);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorMessage('Tài khoản không tồn tại hoặc thông tin không chính xác.');
      } else {
        setErrorMessage('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchForm = () => {
    setIsRegistering(!isRegistering);
    setFormData({ email: '', referenceId: '' });
    setErrorMessage('');
    setSuccessMessage('');
  };

  if (!isFormVisible) {
    return <div className="success-redirect">Đang chuyển hướng...</div>;
  }

  return (
    <div className="auth-container">
      <div className={isRegistering ? "register-form" : "login-form"}>
        <h3 style={{ color: isRegistering ? '#28a745' : '#007bff' }}>
          {isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập'}
        </h3>
        <p>{isRegistering ? 'Vui lòng điền thông tin để tạo tài khoản mới.' : 'Nhập thông tin tài khoản để đăng nhập.'}</p>
        
        <input 
          type="text"
          name="referenceId"
          placeholder="Nhập referenceId"
          value={formData.referenceId}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        
        <input 
          type="email"
          name="email"
          placeholder="Nhập email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isLoading}
        />

        <button 
          onClick={isRegistering ? handleRegister : handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : (isRegistering ? 'Đăng ký' : 'Đăng nhập')}
        </button>

        {errorMessage && (
          <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>
        )}
        {successMessage && (
          <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>
        )}

        <p>
          {isRegistering ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
          <button 
            onClick={handleSwitchForm}
            disabled={isLoading}
            style={{ color: '#007bff', fontWeight: 'bold' }}
          >
            {isRegistering ? "Đăng nhập" : "Đăng ký"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;