import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gray-100 text-gray-900 pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-screen text-center">
      <div className="max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-800 drop-shadow-md">
          Welcome to <span className="text-blue-600">SecureStreamPro</span>
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-10 text-gray-600">
          Your secure streaming solution for all educational needs. Seamless, reliable, and tailored for modern learning.
        </p>
        <Link
          to="/catalog"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default Hero;
