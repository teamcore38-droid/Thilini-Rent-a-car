import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Calendar } from 'lucide-react';
import { Logo } from '../common/Logo';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useSettings } from '../../context/SettingsContext';
import { prefetchFleetPage } from '../../utils/routePrefetch';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings, getWhatsAppUrl } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-200/80'
        }`}
      >
        {/* Top Mini Bar for Desktop */}
        <div className="hidden lg:block bg-charcoal-900 text-gray-300 text-xs py-1.5 px-4 border-b border-charcoal-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                24/7 Airport Delivery & Islandwide Service
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Bandaranaike International Airport (CMB) & Colombo</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-gray-300"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp: {settings.whatsapp}
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="hover:text-brand-400 transition-colors flex items-center gap-1 font-medium text-white"
              >
                <Phone className="w-3.5 h-3.5 text-brand-500" />
                Call: {settings.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onMouseEnter={link.path === '/fleet' ? prefetchFleetPage : undefined}
                  onFocus={link.path === '/fleet' ? prefetchFleetPage : undefined}
                  onTouchStart={link.path === '/fleet' ? prefetchFleetPage : undefined}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-brand-600 font-semibold bg-brand-50'
                        : 'text-charcoal-700 hover:text-brand-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-charcoal-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Direct Phone Call"
              >
                <Phone className="w-4 h-4 text-brand-600" />
                <span className="hidden xl:inline">{settings.phone}</span>
                <span className="xl:hidden">Call</span>
              </a>

              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Now</span>
              </Link>
            </div>

            {/* Mobile Actions: Phone & Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2.5">
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="p-2.5 rounded-2xl text-brand-600 bg-rose-50 border border-rose-100/80 hover:bg-rose-100 transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
                aria-label="Call Thilini Rent A Car"
              >
                <Phone className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl text-charcoal-900 hover:bg-gray-100 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <Logo size="sm" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-charcoal-600 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onTouchStart={link.path === '/fleet' ? prefetchFleetPage : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-colors min-h-[48px] ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 border border-brand-100'
                      : 'text-charcoal-800 hover:bg-gray-50'
                  }`
                }
              >
                <span>{link.name}</span>
                <span className="text-gray-400">›</span>
              </NavLink>
            ))}

            <div className="pt-6 border-t border-gray-100 space-y-3">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-brand-600 text-white rounded-xl font-bold shadow-sm active:bg-brand-700 min-h-[48px]"
              >
                <Calendar className="w-5 h-5" />
                <span>Reserve / Book a Vehicle</span>
              </Link>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 text-white rounded-xl font-bold shadow-sm active:bg-emerald-700 min-h-[48px]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>WhatsApp Enquiry</span>
              </a>

              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-100 text-charcoal-800 rounded-xl font-semibold hover:bg-gray-200 min-h-[48px]"
              >
                <Phone className="w-5 h-5 text-brand-600" />
                <span>Direct Call: {settings.phone}</span>
              </a>
            </div>
          </div>

          {/* Drawer Footer Info */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Bandaranaike International Airport (CMB) & Islandwide</p>
            <p className="mt-1">Thilini Rent A Car • Sri Lanka</p>
          </div>
        </div>
      )}
    </>
  );
};
