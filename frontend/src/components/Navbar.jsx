import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/assets/logosvg.svg"
          alt="Smart Survey Logo"
          className="h-10 w-auto mr-2 object-contain"
        />
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          Smart Survey
        </span>
      </div>

      {/* Navigation Links */}
      <div className="space-x-6 hidden md:flex">
        {[
          { to: '/', label: 'Home' },
          { to: '/features', label: 'Features' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/create', label: 'Create Survey' },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Login/Signup Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/login"
          className="text-blue-600 font-medium hover:underline transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
