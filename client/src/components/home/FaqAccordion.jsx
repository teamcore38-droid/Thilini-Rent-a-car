import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqAccordion = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5">
            Essential information regarding documents, deposits, airport delivery, and fuel policies.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq._id || idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4 bg-gray-50/70 hover:bg-gray-100/70 transition-colors min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-charcoal-900 pr-2">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-600 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-gray-100 text-sm text-charcoal-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
