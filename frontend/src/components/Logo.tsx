import React from "react";

const LOGO_TEXTS: Record<string, string> = {
  en: "Smart Survey",
  hi: "स्मार्ट सर्वे",
};

type LogoProps = {
  selectedLang?: string;
  aiEnabled?: boolean;
  voiceEnabled?: boolean;
  adaptiveEnabled?: boolean;
};

const Logo: React.FC<LogoProps> = ({
  selectedLang = "en",
  aiEnabled = true,
  voiceEnabled = true,
  adaptiveEnabled = true,
}) => {
  return (
    <div className="flex items-center space-x-3" aria-label="Smart Survey Logo">
      <svg
        width="90"
        height="90"
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={LOGO_TEXTS[selectedLang] || LOGO_TEXTS.en}
        role="img"
      >
        <rect width="1024" height="1024" fill="#F7F9FC" />
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
          <text
            x="120"
            y="100"
            fontSize="64"
            fill="#1F2937"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            aria-label={LOGO_TEXTS[selectedLang] || LOGO_TEXTS.en}
          >
            {LOGO_TEXTS[selectedLang] || LOGO_TEXTS.en}
          </text>
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
          <rect x="100" y="300" width="500" height="60" rx="15" fill="#FBBF24" />
          <rect x="100" y="400" width="400" height="60" rx="15" fill="#FB923C" />
          <rect x="100" y="500" width="300" height="60" rx="15" fill="#3B82F6" />
          <rect x="100" y="600" width="200" height="60" rx="15" fill="#1D4ED8" />
          <circle cx="650" cy="330" r="15" fill="#FBBF24" />
          <circle cx="650" cy="430" r="15" fill="#FB923C" />
          <circle cx="650" cy="530" r="15" fill="#3B82F6" />
          <circle cx="650" cy="630" r="15" fill="#1D4ED8" />
        </g>
        <defs>
          <filter id="shadow" x="-20" y="-20" width="800" height="800">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1" />
          </filter>
        </defs>
      </svg>
      {/* Feature badges */}
      <div className="flex items-center space-x-1 ml-2">
        {aiEnabled && (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold shadow" title="AI">
            🤖
          </span>
        )}
        {voiceEnabled && (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold shadow" title="Voice">
            🎙️
          </span>
        )}
        {adaptiveEnabled && (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold shadow" title="Adaptive">
            ⚡
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
