import { useState, useEffect } from 'react';
import ApiService from '../services/apis';

const usePhoneNumber = () => {
  const [phone, setPhone] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const response = await ApiService.getPhoneLogin();
        setData(response.data);
        setPhone(response?.data?.phoneNumber || '');
      } catch (err) {
        console.error('Error fetching phone number:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumber();
  }, []);

  return { data, phone, loading, error };
};

export default usePhoneNumber;
