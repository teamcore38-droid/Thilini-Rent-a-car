import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.webp';

/**
 * Thilini Rent A Car Official Logo Component
 * - Renders the official brand logo from TRC logo.webp
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
    sm: 'h-10 sm:h-11',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-32'
  }[size] || 'h-14 sm:h-16';

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
        loading="eager"
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
