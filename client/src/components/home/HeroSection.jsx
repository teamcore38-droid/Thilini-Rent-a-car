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
        {/* Left side dark vignette gradient to guarantee typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-charcoal-950/95" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">
        {/* Top Mini Pill */}
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950/60 border border-brand-500/40 text-brand-300 text-xs font-semibold backdrop-blur-md mb-4 sm:mb-6 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>Sri Lanka Wide Car Rental & Airport Pickup</span>
          </div>
        </div>

        {/* Main Headline & Supporting Text */}
        <div className="max-w-2xl text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] mb-4 sm:mb-5">
            Your Journey.<br />Your Freedom.
          </h1>
          <p className="text-sm sm:text-lg text-gray-200 font-medium leading-relaxed mb-6 sm:mb-8">
            <span className="md:hidden">Premium, reliable rentals across Sri Lanka.</span>
            <span className="hidden md:inline">
              Premium, reliable self-drive, chauffeur and airport rentals across Sri Lanka.
            </span>
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 transition-all min-h-[48px]"
            >
              <span>Explore Our Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppUrl('Hello Thilini Rent A Car! I would like to inquire about vehicle availability and rates.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md transition-all min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Booking Search Form */}
        <div className="mt-8 sm:mt-12 lg:mt-14">
          <BookingSearchWidget />
        </div>
      </div>
    </div>
  );
};
