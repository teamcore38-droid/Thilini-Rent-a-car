import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Calendar } from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useSettings } from '../../context/SettingsContext';

export const MobileBottomBar = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const location = useLocation();

  // Hide sticky bottom bar on admin dashboard or active booking step page to prevent covering inputs
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav
      aria-label="Mobile quick action navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-3 py-2"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* 1. Direct Call */}
        <a
          href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-slate-100/90 active:bg-slate-200 text-charcoal-900 transition-colors min-h-[48px]"
          aria-label="Call Thilini Rent A Car"
        >
          <Phone className="w-5 h-5 text-brand-600 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">Call Now</span>
        </a>

        {/* 2. WhatsApp Enquiry */}
        <a
          href={getWhatsAppUrl('Hello Thilini Rent A Car! I would like to inquire about car rental availability in Sri Lanka.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-emerald-50 active:bg-emerald-100 text-emerald-900 border border-emerald-100 transition-colors min-h-[48px]"
          aria-label="WhatsApp Enquiry"
        >
          <WhatsAppIcon className="w-5 h-5 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* 3. Book Now */}
        <Link
          to="/book"
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-brand-600 active:bg-brand-700 text-white shadow-md transition-colors min-h-[48px]"
          aria-label="Book Vehicle Now"
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">Book Now</span>
        </Link>
      </div>
    </nav>
  );
};
