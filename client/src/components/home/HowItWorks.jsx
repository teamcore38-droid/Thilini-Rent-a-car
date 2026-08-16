import React from 'react';
import { Car, FileText, CheckCircle2 } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: Car,
      title: '1. Select Your Vehicle',
      description:
        'Browse our diverse fleet of economy hatchbacks, sedans, hybrids, SUVs, and passenger vans with transparent LKR pricing.'
    },
    {
      number: '02',
      icon: FileText,
      title: '2. Send Your Booking Request',
      description:
        'Fill out our simple 3-step reservation request with your dates, pickup location, and contact details without any mandatory upfront payment.'
    },
    {
      number: '03',
      icon: CheckCircle2,
      title: '3. Receive Confirmation',
      description:
        'Our friendly Sri Lankan team verifies vehicle availability and sends your confirmation via WhatsApp, phone, or email within minutes.'
    }
  ];

  return (
    <section className="py-8 sm:py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            How Renting Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5">
            No complicated account registrations or hidden charges. Reserve your vehicle in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-5 sm:p-7 border border-gray-200/90 shadow-subtle flex flex-col items-start"
              >
                <div className="flex items-center justify-between w-full mb-4 sm:mb-5">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-black text-gray-200">{step.number}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-charcoal-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
