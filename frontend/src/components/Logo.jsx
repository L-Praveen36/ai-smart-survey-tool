import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      {/* Icon */}
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 rounded-full animate-pulse shadow-md border border-white"></div>

      {/* Text */}
      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient drop-shadow-sm">
        Smart Survey
      </h1>
    </div>
  );
};

export default Logo;
