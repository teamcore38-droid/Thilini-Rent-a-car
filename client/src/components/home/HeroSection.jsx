import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import { BookingSearchWidget } from './BookingSearchWidget';
import { useSettings } from '../../context/SettingsContext';
import heroDesktopImg from '../../assets/hero-desktop.webp';
import heroMobileImg from '../../assets/hero-mobile.webp';

export const HeroSection = () => {
  const { getWhatsAppUrl } = useSettings();

  return (
    <div className="relative bg-charcoal-950 text-white">
      {/* Desktop Hero Background (Visible on md and larger) */}
      <div className="hidden md:block absolute inset-0 z-0">
        <img
          src={heroDesktopImg}
          alt="Thilini Rent A Car Fleet on Sri Lanka Coastal Highway"
          className="w-full h-full object-cover object-right lg:object-center"
          loading="eager"
        />
        {/* Dark left gradient to ensure clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-black/30" />
      </div>

      {/* Mobile Hero Background (Visible on < md) */}
      <div className="block md:hidden absolute inset-0 z-0">
        <img
          src={heroMobileImg}
          alt="Thilini Rent A Car Fleet in Sri Lanka"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-charcoal-950/90" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
        {/* Top Mini Pill */}
        <div className="flex justify-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/70 border border-brand-500/40 text-brand-300 text-[11px] font-semibold backdrop-blur-md mb-3 sm:mb-6 shadow-sm">
            <MapPin className="w-3 h-3 text-brand-400" />
            <span>Sri Lanka Wide Car Rental & Airport Pickup</span>
          </div>
        </div>

        {/* Main Headline & Supporting Text */}
        <div className="max-w-2xl text-left">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] mb-2 sm:mb-4 max-w-[65%] sm:max-w-none">
            Your Journey.<br />Your Freedom.
          </h1>
          <p className="text-xs sm:text-base lg:text-lg text-gray-200 font-medium leading-relaxed mb-4 sm:mb-8 max-w-[62%] sm:max-w-xl">
            <span className="md:hidden">Premium, reliable rentals across Sri Lanka.</span>
            <span className="hidden md:inline">
              Premium, reliable self-drive, chauffeur and airport rentals across Sri Lanka.
            </span>
          </p>

          {/* Action CTAs: Side-by-side on both mobile and desktop */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:flex sm:flex-row justify-start max-w-md sm:max-w-none">
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-7 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-base text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-md hover:shadow-lg transition-all min-h-[46px] text-center"
            >
              <span className="truncate">Explore Our Fleet</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>

            <a
              href={getWhatsAppUrl('Hello Thilini Rent A Car! I would like to inquire about vehicle availability and rates.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-base text-white bg-[#008f58] hover:bg-[#007a4b] active:bg-[#00663e] shadow-md hover:shadow-lg transition-all min-h-[46px] text-center"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
              <span className="truncate">WhatsApp Now</span>
            </a>
          </div>
        </div>

        {/* Quick Booking Search Form - Overlaps half in hero background and half below */}
        <div className="mt-14 sm:mt-20 lg:mt-24 -mb-28 sm:-mb-32 lg:-mb-36">
          <BookingSearchWidget />
        </div>
      </div>
    </div>
  );
};
