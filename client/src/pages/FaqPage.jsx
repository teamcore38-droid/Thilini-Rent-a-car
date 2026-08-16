import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Phone, HelpCircle } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { contentService } from '../services/contentService';
import { useSettings } from '../context/SettingsContext';

export const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const { settings, getWhatsAppUrl } = useSettings();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await contentService.getFAQs();
        const list = data?.faqs || [];
        setFaqs(list);
        setFilteredFaqs(list);

        const cats = ['All', ...new Set(list.map((f) => f.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  useEffect(() => {
    let result = faqs;
    if (selectedCategory !== 'All') {
      result = result.filter((f) => f.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    }
    setFilteredFaqs(result);
  }, [selectedCategory, searchQuery, faqs]);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Help & Information
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 mt-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Everything you need to know about renting a car in Sri Lanka with Thilini Rent A Car.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. driving licence, deposit, airport, fuel)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-brand-600 focus:border-brand-600 shadow-subtle min-h-[48px]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[40px] ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-charcoal-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-2xl border border-gray-200" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-charcoal-800 text-sm">No matching questions found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Have a question not listed here? Chat directly with us on WhatsApp or call our team.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq._id || idx}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-subtle transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors min-h-[52px]"
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
                    <div className="px-5 sm:px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Unanswered Questions Assistance Box */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-subtle text-center">
          <h3 className="text-lg font-extrabold text-charcoal-900 mb-2">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6">
            Our team is available 24/7 on WhatsApp and phone to answer all your vehicle and rental queries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={getWhatsAppUrl('Hello Thilini Rent A Car! I have a question regarding vehicle rentals.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all min-h-[44px]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>

            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-charcoal-800 rounded-xl font-bold text-xs transition-colors min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-brand-600" />
              <span>Call: {settings.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
