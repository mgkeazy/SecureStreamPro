import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const setRole = useUserStore((state) => state.setRole);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/login-user',
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      setRole(response.data.user.role);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 drop-shadow-sm">
          Welcome Back
        </h2>

        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
