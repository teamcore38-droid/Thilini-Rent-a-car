import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Key, UserCheck, Plane, HeartHandshake, CalendarDays, Car, ArrowRight, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { contentService } from '../services/contentService';
import { useSettings } from '../context/SettingsContext';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getWhatsAppUrl } = useSettings();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await contentService.getServices();
        setServices(data?.services || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const serviceIcons = {
    Key: Key,
    UserCheck: UserCheck,
    Plane: Plane,
    HeartHandshake: HeartHandshake,
    CalendarDays: CalendarDays,
    Car: Car
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Our Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 mt-3">
            Car Rental Solutions Across Sri Lanka
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
            Tailored transportation services designed for leisure tourists, business executives, families, and special occasions.
          </p>
        </div>

        {/* Services Showcase Cards */}
        <div className="space-y-8 mb-16">
          {services.map((srv, idx) => {
            const IconComp = serviceIcons[srv.iconName] || Car;
            const isReversed = idx % 2 !== 0;
            return (
              <div
                key={srv._id || idx}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-subtle hover:shadow-card transition-all flex flex-col lg:flex-row items-center gap-8"
              >
                {/* Content */}
                <div className={`flex-1 space-y-4 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-charcoal-900">
                    {srv.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {srv.fullDescription || srv.shortDescription}
                  </p>

                  {srv.features && srv.features.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2">
                        Key Features & Inclusions:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700">
                        {srv.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                            <span className="text-brand-600 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Link
                      to={`/book?serviceType=${encodeURIComponent(srv.title)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all min-h-[44px]"
                    >
                      <span>Book This Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={getWhatsAppUrl(`Hello Thilini Rent A Car! I would like to inquire about *${srv.title}* in Sri Lanka.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all min-h-[44px]"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                  </div>
                </div>

                {/* Aesthetic Visual Side */}
                <div className={`w-full lg:w-96 rounded-2xl overflow-hidden bg-gray-100 aspect-[16/10] shrink-0 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img
                    src={
                      srv.imageUrl ||
                      (idx === 0
                        ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
                        : idx === 1
                        ? 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80'
                        : idx === 2
                        ? 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
                        : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80')
                    }
                    alt={srv.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Airport Delivery Guarantee Banner */}
        <div className="bg-charcoal-900 rounded-3xl p-8 sm:p-12 text-white border border-charcoal-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
              Airport Service Guarantee
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Arriving at Bandaranaike International Airport (CMB)?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Share your flight number and our team will have your sanitized rental vehicle or chauffeur waiting at the arrivals terminal on time.
            </p>
          </div>
          <Link
            to="/book?serviceType=Airport%20Transfer&pickupLocation=Bandaranaike%20International%20Airport%20(CMB%20-%20Katunayake)"
            className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shrink-0 min-h-[44px] flex items-center justify-center"
          >
            Reserve Airport Transfer
          </Link>
        </div>
      </div>
    </div>
  );
};
