import React from 'react';
import { Sparkles, DollarSign, Clock, MapPin, Check, Headphones } from 'lucide-react';

export const WhyChooseUs = () => {
  const points = [
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      desc: 'All daily rates, deposits, and mileage limits are explicitly stated in Sri Lankan Rupees (LKR) with no hidden fees.'
    },
    {
      icon: Sparkles,
      title: 'Clean & Sanitized Fleet',
      desc: 'Every vehicle undergoes thorough cleaning, vacuuming, and mechanical inspection before handover.'
    },
    {
      icon: MapPin,
      title: 'Airport & Islandwide Delivery',
      desc: 'Prompt vehicle delivery to Katunayake Airport (CMB), Colombo hotels, Negombo, or custom destinations across Sri Lanka.'
    },
    {
      icon: Clock,
      title: 'Quick WhatsApp Communication',
      desc: 'Direct communication with our local team for fast booking confirmations and roadside advice.'
    },
    {
      icon: Check,
      title: 'Flexible Hire Options',
      desc: 'Choose between self-drive freedom, professional chauffeurs, wedding hires, or cost-saving long-term rentals.'
    },
    {
      icon: Headphones,
      title: 'Dedicated Customer Support',
      desc: 'Friendly local assistance throughout your journey to ensure a smooth, worry-free trip in Sri Lanka.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Our Commitment
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-3">
            Why Choose Thilini Rent A Car
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Committed to providing honest, dependable, and comfortable transportation for locals and international visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50/60 border border-gray-100 hover:border-brand-200 hover:bg-white hover:shadow-subtle transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-charcoal-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
