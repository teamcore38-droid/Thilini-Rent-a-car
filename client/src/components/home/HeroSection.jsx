import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, ShieldCheck, MapPin, Award } from 'lucide-react';
import { BookingSearchWidget } from './BookingSearchWidget';
import { useSettings } from '../../context/SettingsContext';

export const HeroSection = () => {
  const { settings, getWhatsAppUrl } = useSettings();

  return (
    <div className="relative bg-charcoal-900 overflow-hidden text-white">
      {/* Background Image with Dark Contrast Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=2000&q=80"
          alt="Rental vehicle on scenic Sri Lankan highway"
          className="w-full h-full object-cover object-center opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/80 to-charcoal-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-20 pb-16 sm:pb-24">
        {/* Top Mini Pill */}
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-semibold backdrop-blur-sm mb-6">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>Sri Lanka Wide Car Rental & Airport Pickup</span>
          </div>
        </div>

        {/* Main Headline & Supporting Text */}
        <div className="max-w-3xl text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {settings.tagline || 'Your Reliable Journey Starts Here'}
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-300 font-normal leading-relaxed">
            {settings.supportingText ||
              'Affordable and reliable self-drive, chauffeur-driven and airport rental services across Sri Lanka.'}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center sm:justify-start">
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-lg hover:shadow-brand-600/30 transition-all min-h-[48px]"
            >
              <span>Find a Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppUrl('Hello Thilini Rent A Car! I would like to check vehicle availability and rates.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md transition-all min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Integrated Quick Booking Search Form */}
        <div className="mt-12 sm:mt-16">
          <div className="text-left mb-2.5">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Quick Reservation & Rate Finder
            </span>
          </div>
          <BookingSearchWidget />
        </div>
      </div>
    </div>
  );
};
