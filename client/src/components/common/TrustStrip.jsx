import React from 'react';
import { ShieldCheck, CalendarCheck, Plane, Headset } from 'lucide-react';

export const TrustStrip = () => {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Well-Maintained Vehicles',
      desc: 'Inspected, serviced, and sanitized before every handover.'
    },
    {
      icon: CalendarCheck,
      title: 'Flexible Rental Periods',
      desc: 'Daily, weekly, and customized long-term rental plans.'
    },
    {
      icon: Plane,
      title: 'Airport Pickup Available',
      desc: 'Prompt delivery at Katunayake Airport (CMB) & Colombo.'
    },
    {
      icon: Headset,
      title: 'Friendly Local Support',
      desc: 'Direct WhatsApp and phone assistance whenever you need.'
    }
  ];

  return (
    <section className="bg-white border-y border-gray-100 py-8 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-50/70 border border-gray-100/80 hover:bg-brand-50/40 hover:border-brand-100 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-brand-100 text-brand-700 shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
