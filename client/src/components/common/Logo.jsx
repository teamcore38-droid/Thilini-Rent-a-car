import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.webp';

/**
 * Thilini Rent A Car Official Logo Component
 * - Renders the official transparent brand logo (Thilini-Rent-A-Car-Logo-Transparent.webp)
 * - Fully responsive with crisp aspect-ratio preservation
 * - High-contrast support for dark backgrounds (footer, admin sidebar)
 */
export const Logo = ({
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'default', // 'default' | 'white' | 'dark'
  asLink = true
}) => {
  const sizeClasses = {
    sm: 'h-9 sm:h-10 max-h-[44px]',
    md: 'h-11 sm:h-13 md:h-14 max-h-[58px]',
    lg: 'h-16 sm:h-20 max-h-[80px]',
    xl: 'h-24 sm:h-28 max-h-[110px]'
  }[size] || 'h-11 sm:h-13 md:h-14 max-h-[58px]';

  const isDarkSurface = variant === 'white' || variant === 'dark';

  const content = (
    <div
      className={`inline-flex items-center justify-center select-none transition-transform duration-200 hover:scale-[1.02] ${
        isDarkSurface ? 'bg-white rounded-xl px-3 py-1.5 shadow-sm' : ''
      } ${className}`}
    >
      <img
        src={logoImg}
        alt="Thilini Rent A Car"
        className={`${sizeClasses} w-auto object-contain`}
        width="2030"
        height="719"
        loading="eager"
        decoding="async"
      />
    </div>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-xl"
        aria-label="Thilini Rent A Car Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};
