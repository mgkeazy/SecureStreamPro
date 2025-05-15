import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = useUserStore((state)=> state.isLoggedIn);
  const role = useUserStore((state)=> state.role);


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/registration",
        { name, email, password }
      );
      console.log("Registration successful:", response.data);
      // Redirect to activation page with the activation token
      navigate("/activate", {
        state: { activationToken: response.data.activationToken },
      });
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && role === 'admin') {
      console.log('hello admin');
      navigate('/uploadCourse', { replace: true });
    } else if (isLoggedIn) {
      navigate('/courses', { replace: true });
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
