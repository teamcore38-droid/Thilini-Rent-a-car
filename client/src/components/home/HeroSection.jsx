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
    <div className="relative bg-charcoal-950 overflow-hidden text-white">
      {/* Desktop Hero Background (Visible on md and larger) */}
      <div className="hidden md:block absolute inset-0 z-0">
        <img
          src={heroDesktopImg}
          alt="Thilini Rent A Car Fleet on Sri Lanka Coastal Highway"
          className="w-full h-full object-cover object-right lg:object-center"
          loading="eager"
        />
        {/* Dark left gradient to ensure clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-black/30" />
      </div>

      {/* Mobile Hero Background (Visible on < md) */}
      <div className="block md:hidden absolute inset-0 z-0">
        <img
          src={heroDesktopImg}
          alt="Thilini Rent A Car Fleet in Sri Lanka"
          className="w-full h-[55%] sm:h-[60%] object-cover object-[75%_top]"
          loading="eager"
        />
        {/* Soft vignette on top-left to elevate headline contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent h-[55%] sm:h-[60%]" />
        {/* Dark bottom gradient that blends seamlessly into the rest of the section */}
        <div className="absolute top-[35%] bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-charcoal-950/95 to-charcoal-950" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 lg:pt-16 pb-10 sm:pb-16 lg:pb-20">
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
          <p className="text-xs sm:text-base lg:text-lg text-gray-200 font-medium leading-relaxed mb-5 sm:mb-8 max-w-[62%] sm:max-w-xl">
            <span className="md:hidden">Premium, reliable rentals across Sri Lanka.</span>
            <span className="hidden md:inline">
              Premium, reliable self-drive, chauffeur and airport rentals across Sri Lanka.
            </span>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-start">
            <Link
              to="/fleet"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-md hover:shadow-lg transition-all min-h-[48px]"
            >
              <span>Explore Our Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppUrl('Hello Thilini Rent A Car! I would like to inquire about vehicle availability and rates.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-[#008f58] hover:bg-[#007a4b] active:bg-[#00663e] shadow-md hover:shadow-lg transition-all min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Booking Search Form */}
        <div className="mt-5 sm:mt-12 lg:mt-14">
          <BookingSearchWidget />
        </div>
      </div>
    </div>
  );
};
