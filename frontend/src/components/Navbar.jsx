import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo'; // Use your feature-rich Logo component

const NAV_LABELS = {
  en: {
    home: 'Home',
    features: 'Features',
    dashboard: 'Dashboard',
    create: 'Create Survey',
    login: 'Login',
    signup: 'Sign Up'
  },
  hi: {
    home: 'होम',
    features: 'फीचर्स',
    dashboard: 'डैशबोर्ड',
    create: 'सर्वे बनाएँ',
    login: 'लॉग इन',
    signup: 'साइन अप'
  }
  // Add more languages if needed
};

const Navbar = ({
  selectedLang = "en", // Pass via props or context if available
  aiEnabled = true,
  voiceEnabled = true,
  adaptiveEnabled = true
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: NAV_LABELS[selectedLang].home },
    { to: '/features', label: NAV_LABELS[selectedLang].features },
    { to: '/dashboard', label: NAV_LABELS[selectedLang].dashboard },
    { to: '/create', label: NAV_LABELS[selectedLang].create },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center">
      {/* Logo and Brand */}
      <div className="flex items-center">
        {/* Feature-rich Logo component */}
        <Logo
          selectedLang={selectedLang}
          aiEnabled={aiEnabled}
          voiceEnabled={voiceEnabled}
          adaptiveEnabled={adaptiveEnabled}
        />
        <span className="text-xl font-bold text-gray-800 tracking-tight ml-2">
          {NAV_LABELS[selectedLang].home} Survey
        </span>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="space-x-6 hidden md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth Buttons (Desktop) */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/login"
          className="text-blue-600 font-medium hover:underline transition-colors duration-200"
        >
          {NAV_LABELS[selectedLang].login}
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
        >
          {NAV_LABELS[selectedLang].signup}
        </Link>
        {/* Language picker */}
        <select
          className="ml-2 px-2 py-1 border rounded bg-gray-50 text-sm"
          value={selectedLang}
          onChange={e => {
            // Wire to your language change handler if using global state
          }}
        >
          <option value="en">EN</option>
          <option value="hi">HI</option>
          {/* Add more langs */}
        </select>
      </div>

      {/* Mobile nav toggle */}
      <button
        className="md:hidden flex items-center px-2 py-1 border rounded"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Open menu"
      >
        {/* You can use a menu SVG/icon here if you like */}
        <span className="material-icons text-gray-600">menu</span>
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-3 md:hidden z-20">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-800 font-semibold py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="text-blue-600 font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            {NAV_LABELS[selectedLang].login}
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            {NAV_LABELS[selectedLang].signup}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
