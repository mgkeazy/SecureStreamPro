import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const logout = useUserStore((state) => state.logout);
    const role = useUserStore((state) => state.role);

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <header className="bg-gray-800 py-4 fixed top-0 left-0 w-full z-10 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6 sm:px-8">
                {/* Brand Name */}
                <h1 className="text-white text-2xl font-semibold">SecureStreamPro</h1>

                {/* Navigation Links */}
                <nav className="flex gap-6 items-center">
                    <a href="/" className="text-white hover:text-gray-400 transition-colors">Home</a>

                    {!isLoggedIn && (
                        <a href="/register" className="text-white hover:text-gray-400 transition-colors">Register</a>
                    )}

                    {isLoggedIn && role === 'user' && (
                        <a href="/courses" className="text-white hover:text-gray-400 transition-colors">MyCourses</a>
                    )}

                    {isLoggedIn && role !== 'user' && (
                        <a href="/uploadCourse" className="text-white hover:text-gray-400 transition-colors">UploadCourse</a>
                    )}

                    {isLoggedIn ? (
                        <button 
                            onClick={handleLogout} 
                            className="text-white hover:text-gray-400 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <a href="/login" className="text-white hover:text-gray-400 transition-colors">Login</a>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
