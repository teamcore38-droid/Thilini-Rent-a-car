import React from 'react';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const PrivacyPage = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Customer Data Safety
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Last Updated: 2026 • Thilini Rent A Car
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card space-y-8 text-sm text-charcoal-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-600" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you submit a vehicle enquiry or booking request on <strong>{settings.businessName}</strong>, we collect your name, contact phone/WhatsApp number, optional email address, pickup/return dates, and flight number (when airport delivery is requested).
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-600" />
              <span>2. How We Use Your Information</span>
            </h2>
            <p>
              We use your contact details solely for the purpose of communicating vehicle availability, verifying booking details, and providing airport handover or customer assistance. We never sell or share your personal contact details with third-party advertising brokers.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-600" />
              <span>3. Data Security & Confidentiality</span>
            </h2>
            <p>
              All reservation records are stored securely with restricted administrative access. Booking reference lookup functions do not display private phone numbers or personal addresses to the public.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100">
            <h2 className="text-base font-extrabold text-charcoal-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>4. Contact Regarding Your Data</span>
            </h2>
            <p>
              If you wish to update or delete your booking enquiry details from our records, please contact us at <a href={`mailto:${settings.email}`} className="text-brand-600 font-bold">{settings.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
