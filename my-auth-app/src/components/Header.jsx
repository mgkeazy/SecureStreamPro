import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { Link } from 'react-router-dom';

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
                    <Link to="/" className="text-white hover:text-gray-400 transition-colors">Home</Link>

                    {!isLoggedIn && (
                        <Link to="/register" className="text-white hover:text-gray-400 transition-colors">Register</Link>
                    )}

                    {isLoggedIn && role === 'user' && (
                        <Link to="/My-courses" className="text-white hover:text-gray-400 transition-colors">MyCourses</Link>
                    )}

                    {isLoggedIn && role !== 'user' && (
                        <Link to="/uploadCourse" className="text-white hover:text-gray-400 transition-colors">UploadCourse</Link>
                    )}

                    {isLoggedIn ? (
                        <button 
                            onClick={handleLogout} 
                            className="text-white hover:text-gray-400 transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="text-white hover:text-gray-400 transition-colors">Login</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
