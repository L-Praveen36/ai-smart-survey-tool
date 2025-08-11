// src/components/Logo.tsx

const Logo = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background */}
    <rect width="1024" height="1024" fill="#F7F9FC" />

    {/* Main Card */}
    <g transform="translate(150,150)">
      <rect
        x="0"
        y="0"
        width="724"
        height="724"
        rx="50"
        fill="#FFFFFF"
        stroke="#1F2937"
        strokeWidth="8"
        filter="url(#shadow)"
      />

      {/* Title */}
      <text
        x="120"
        y="100"
        fontSize="64"
        fill="#1F2937"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        Smart Survey
      </text>

      {/* Check Circle */}
      <circle
        cx="230"
        cy="180"
        r="80"
        stroke="#2563EB"
        strokeWidth="8"
        fill="#E0F2FE"
      />
      <path
        d="M200 180 L225 205 L270 150"
        stroke="#2563EB"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bars */}
      <rect x="100" y="300" width="500" height="60" rx="15" fill="#FBBF24" />
      <rect x="100" y="400" width="400" height="60" rx="15" fill="#FB923C" />
      <rect x="100" y="500" width="300" height="60" rx="15" fill="#3B82F6" />
      <rect x="100" y="600" width="200" height="60" rx="15" fill="#1D4ED8" />

      {/* Circles */}
      <circle cx="650" cy="330" r="15" fill="#FBBF24" />
      <circle cx="650" cy="430" r="15" fill="#FB923C" />
      <circle cx="650" cy="530" r="15" fill="#3B82F6" />
      <circle cx="650" cy="630" r="15" fill="#1D4ED8" />
    </g>

    {/* Shadow filter */}
    <defs>
      <filter id="shadow" x="-20" y="-20" width="800" height="800">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1" />
      </filter>
    </defs>
  </svg>
);

export default Logo;
