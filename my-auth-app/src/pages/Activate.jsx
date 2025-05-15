import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const Activate = () => {
  const isLoggedIn = useUserStore((state)=> state.isLoggedIn);
  const role = useUserStore((state)=> state.role);
  const [activationCode, setActivationCode] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the activation token from the location state
  const activationToken = location.state?.activationToken || '';
    console.log(activationToken)
  const handleActivation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/activate-user', {
        activation_token: activationToken,
        activation_code: activationCode,
      });
      console.log('Activation successful:', response.data);
      // Redirect to login or home page after successful activation
      navigate('/');
    } catch (error) {
      console.error('Error activating account:', error);
    }
  };
  useEffect(() => {
    if (isLoggedIn && role === 'admin') {
      navigate('/uploadCourse', { replace: true });
    } else if (isLoggedIn) {
      navigate('/courses', { replace: true });
    }
  }, [isLoggedIn, role, navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 via-purple-500 to-blue-600">
      <form onSubmit={handleActivation} className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Activate Account</h2>
        <div>
          <label htmlFor="activationCode" className="block text-sm font-medium text-gray-700">Activation Code</label>
          <input
            type="text"
            id="activationCode"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            placeholder="Enter your 4-digit code"
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <button type="submit" className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
          Activate
        </button>
      </form>
    </div>
  );
};

export default Activate;