import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-card text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5">
          <Car className="w-8 h-8" />
        </div>
        <span className="text-4xl font-black text-charcoal-900 block mb-1">404</span>
        <h1 className="text-lg font-bold text-charcoal-800 mb-2">Page Not Found</h1>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/fleet"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-charcoal-800 rounded-xl font-bold text-xs transition-colors min-h-[44px]"
          >
            <Car className="w-4 h-4 text-brand-600" />
            <span>Browse Rental Fleet</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
