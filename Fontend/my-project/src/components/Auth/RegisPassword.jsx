import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input, Button, message } from 'antd';
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
  const [passwordVisible, setPasswordVisible] = useState(false); // Trạng thái hiển thị mật khẩu

  const handleReset = async () => {
    if (password !== confirmPassword) {
      message.error('Mật khẩu không khớp!');
      return;
    }
    navigate(`/auth/complete-profile?phone=${phone}`);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-300'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold text-blue-600'>Zalo</h1>
          <p className='text-gray-600 mt-3'>Nhập mật khẩu</p>
        </div>
        <div className='flex flex-col items-center gap-4 mt-8'>
          <Input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <Input
            type={passwordVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Button onClick={handleReset} type='primary' className='w-full mt-4'>
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
