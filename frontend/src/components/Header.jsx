import React from "react";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white border-b border-gray-200">
      <Logo />
      <nav className="flex space-x-6">
        {[
          { name: "Home", path: "/" },
          { name: "Survey Builder", path: "/builder" },
          { name: "Dashboard", path: "/dashboard" },
        ].map((link) => (
          <a
            key={link.path}
            href={link.path}
            className="text-gray-700 font-medium hover:text-blue-600 hover:underline underline-offset-4 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
