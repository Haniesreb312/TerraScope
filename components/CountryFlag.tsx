import React from 'react';

interface CountryFlagProps {
  isoCode: string;
  name: string;
  className?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ isoCode, name, className = '' }) => {
  if (!isoCode) return null;
  
  // Using flagcdn for high-quality flag images
  // We use w640 to ensure good quality on high DPI screens
  const flagUrl = `https://flagcdn.com/w640/${isoCode.toLowerCase()}.png`;

  return (
    <div className={`relative overflow-hidden rounded-lg bg-slate-800 ${className}`}>
      <img
        src={flagUrl}
        alt={`Flag of ${name}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Subtle gloss/highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
};