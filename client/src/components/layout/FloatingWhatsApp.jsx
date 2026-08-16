import React from 'react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useSettings } from '../../context/SettingsContext';

export const FloatingWhatsApp = () => {
  const { getWhatsAppUrl } = useSettings();

  return (
    <aside
      aria-label="Instant WhatsApp Enquiry"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40"
    >
      <a
        href={getWhatsAppUrl('Hello Thilini Rent A Car! I would like to inquire about renting a vehicle in Sri Lanka.')}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa4f] text-white p-3.5 md:px-4 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
        aria-label="Chat directly on WhatsApp with Thilini Rent A Car"
      >
        <div className="relative flex items-center justify-center">
          <WhatsAppIcon className="w-6 h-6 text-white shrink-0" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
          </span>
        </div>
        <span className="hidden md:inline-block font-bold text-sm tracking-wide pr-1">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
};
