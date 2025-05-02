import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input, Button } from 'antd';
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';

const RegisPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // validate khi gõ mật khẩu
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự!');
    } else {
      setPasswordError('');
    }

    // đồng thời kiểm tra khớp
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp!');
    } else {
      setConfirmPasswordError('');
    }
  };

  // validate khi gõ lại mật khẩu
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError('Mật khẩu không khớp!');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleReset = () => {
    if (passwordError || confirmPasswordError || !password || !confirmPassword)
      return;

    localStorage.setItem('password', password);
    navigate('/regis-profile');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-300'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold text-blue-600'>Zalo</h1>
          <p className='text-gray-600 mt-3'>Nhập mật khẩu</p>
        </div>
        <div className='flex flex-col items-center gap-4 mt-8 w-full'>
          <div className='w-full'>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder='Mật khẩu mới'
              prefix={<LockOutlined />}
              suffix={
                <div
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: 'pointer' }}
                >
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              }
              className='w-full'
            />
            {passwordError && (
              <p className='text-red-500 text-sm mt-1'>{passwordError}</p>
            )}
          </div>
          <div className='w-full'>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder='Nhập lại mật khẩu'
              prefix={<LockOutlined />}
              suffix={
                <div
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  style={{ cursor: 'pointer' }}
                >
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              }
              className='w-full'
            />
            {confirmPasswordError && (
              <p className='text-red-500 text-sm mt-1'>
                {confirmPasswordError}
              </p>
            )}
          </div>
          <Button
            onClick={handleReset}
            type='primary'
            className='w-full mt-4'
            disabled={!!passwordError || !!confirmPasswordError}
          >
            Xác nhận
          </Button>
          <Button onClick={() => navigate('/')} className='w-full'>
            Quay về
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisPassword;
