import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Thilini Rent A Car Branding Logo Component
 * - Supports custom image upload (/logo.png, /logo.svg)
 * - Renders crisp vector fallback with proper aspect ratio without distortion
 * - Supports light & dark backgrounds and multiple sizes
 */
export const Logo = ({
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'default', // 'default' | 'white' | 'dark'
  showTagline = true,
  asLink = true
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: { img: 'h-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { img: 'h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { img: 'h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'h-20', text: 'text-3xl', sub: 'text-sm' }
  }[size] || { img: 'h-10', text: 'text-xl', sub: 'text-[10px]' };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* If custom logo image exists in public folder, try loading it */}
      {!imageError ? (
        <img
          src="/logo.png"
          alt="Thilini Rent A Car"
          className={`${sizeClasses.img} w-auto object-contain transition-transform`}
          onError={() => setImageError(true)}
          loading="eager"
        />
      ) : (
        /* Crisp, precision SVG Brand Emblem */
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center shadow-md border border-brand-500/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-white drop-shadow"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[7px] text-charcoal-900 font-black">★</span>
            </div>
          </div>
        </div>
      )}

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center tracking-wider font-black uppercase">
          <span className={variant === 'white' ? 'text-white' : 'text-brand-600'}>
            THILINI
          </span>
          <span className={`ml-1.5 ${variant === 'white' ? 'text-gray-200' : 'text-charcoal-800'} font-bold`}>
            RENT A CAR
          </span>
        </div>
        {showTagline && (
          <span className={`${sizeClasses.sub} tracking-widest uppercase font-semibold ${
            variant === 'white' ? 'text-gray-300' : 'text-charcoal-500'
          }`}>
            Sri Lanka • Self-Drive & Chauffeur
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-md">
        {content}
      </Link>
    );
  }

  return content;
};
