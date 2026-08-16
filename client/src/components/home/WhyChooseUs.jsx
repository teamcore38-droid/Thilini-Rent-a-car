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
    <section className="py-8 sm:py-10 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Our Commitment
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            Why Choose Thilini Rent A Car
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5">
            Committed to providing honest, dependable, and comfortable transportation for locals and international visitors.
          </p>
        </div>

        {/* Swipeable on mobile (< md), responsive grid on desktop (md+) */}
        <div className="flex md:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-2 md:pb-0">
          {points.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div
                key={idx}
                className="w-[82vw] sm:w-auto shrink-0 sm:shrink snap-center p-5 sm:p-6 rounded-2xl bg-gray-50/60 border border-gray-100 hover:border-brand-200 hover:bg-white hover:shadow-subtle transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3.5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-charcoal-900 mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex md:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-gray-400 mt-2">
          <span>← Swipe to explore reasons →</span>
        </div>
      </div>
    </section>
  );
};
