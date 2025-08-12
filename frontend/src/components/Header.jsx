import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Use Link for SPA navigation
import Logo from "./Logo";
// If using a global app context for language and features:
import { AppContext } from "../context/AppContext"; // Adjust path as needed

// Nav labels in different languages
const NAV_LABELS = {
  en: {
    Home: "Home",
    Builder: "Survey Builder",
    Dashboard: "Dashboard"
  },
  hi: {
    Home: "होम",
    Builder: "सर्वे निर्माण",
    Dashboard: "डैशबोर्ड"
  }
};

// Optional feature labels
const featureItems = [
  { name: "AI", icon: "🤖", enabled: "aiEnabled" },
  { name: "Voice", icon: "🎙️", enabled: "voiceEnabled" },
  { name: "Adaptive", icon: "⚡", enabled: "adaptiveEnabled" }
];

const Header = () => {
  // Grab context; fallback if not used
  const { selectedLang = "en", aiEnabled = true, voiceEnabled = true, adaptiveEnabled = true } = useContext(AppContext) || {};

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Builder", path: "/builder" },
    { name: "Dashboard", path: "/dashboard" }
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white border-b border-gray-200">
      <Logo />
      <nav className="flex space-x-6 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="text-gray-700 font-medium hover:text-blue-600 hover:underline underline-offset-4 transition-colors duration-200"
          >
            {/* Use selected language for link label */}
            {NAV_LABELS[selectedLang][link.name] || link.name}
          </Link>
        ))}

        {/* Feature badges/icons */}
        {featureItems.map(
          (item) =>
            eval(item.enabled) && (
              <span
                key={item.name}
                className={`ml-2 bg-gray-100 text-xs font-semibold px-2 py-1 rounded flex items-center`}
                title={`Supports ${item.name} features`}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </span>
            )
        )}

        {/* Language picker (if multilingual) */}
        <select
          value={selectedLang}
          onChange={e => {
            // Add your language context setter here
            // updateLang(e.target.value)
          }}
          className="ml-4 px-2 py-1 rounded border border-gray-300 bg-gray-50 text-sm"
        >
          <option value="en">EN</option>
          <option value="hi">HI</option>
          {/* Add more supported languages here */}
        </select>
      </nav>
    </header>
  );
};

export default Header;
