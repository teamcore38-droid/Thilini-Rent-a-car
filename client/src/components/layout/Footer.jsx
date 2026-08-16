import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { Logo } from '../common/Logo';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-gray-300 border-t-4 border-brand-600">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand Profile */}
          <div className="space-y-4">
            <Logo variant="white" size="md" />
            <p className="text-sm text-gray-400 leading-relaxed mt-2">
              Reliable, affordable self-drive and chauffeur-driven car rental services across Sri Lanka. 24/7 delivery to Bandaranaike International Airport (CMB) and major destinations.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Sri Lankan Rental Service</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links & Fleet */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-sm border-b border-charcoal-700 pb-2">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-500" /> Home
                </Link>
              </li>
              <li>
                <Link to="/fleet" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-500" /> Our Fleet & Rates
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-500" /> Rental Services
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-500" /> Booking Request
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-500" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-brand-500" /> FAQ & Requirements
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services Provided */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-sm border-b border-charcoal-700 pb-2">
              Rental Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Self-Drive Rentals
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Chauffeur-Driven Tours
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Katunayake Airport Transfers (CMB)
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Wedding & Event Car Hire
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> Monthly & Corporate Leasing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Business Hours */}
          <div className="space-y-3.5">
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-sm border-b border-charcoal-700 pb-2">
              Contact & Location
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-500 shrink-0 mt-1" />
                <span>{settings.phone}</span>
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-emerald-400 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-500 shrink-0 mt-1" />
                <span>{settings.email}</span>
              </a>

              <div className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-1" />
                <span>{settings.address}</span>
              </div>

              <div className="flex items-start gap-2.5 text-gray-400 pt-1">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>{settings.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Sub-footer */}
        <div className="mt-10 pt-6 border-t border-charcoal-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {currentYear} Thilini Rent A Car. All rights reserved. Sri Lanka.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Rental Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/admin/login" className="text-charcoal-600 hover:text-gray-400 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
