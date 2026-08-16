import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Key, UserCheck, Plane, HeartHandshake, CalendarDays, Sparkles } from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { TrustStrip } from '../components/common/TrustStrip';
import { VehicleCard } from '../components/common/VehicleCard';
import { VehicleCardSkeleton } from '../components/common/VehicleCardSkeleton';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { FaqAccordion } from '../components/home/FaqAccordion';
import { vehicleService } from '../services/vehicleService';
import { contentService } from '../services/contentService';

export const HomePage = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [vehiclesRes, servicesRes, faqsRes, testimonialsRes] = await Promise.all([
          vehicleService.getFeaturedVehicles().catch(() => ({ vehicles: [] })),
          contentService.getServices().catch(() => ({ services: [] })),
          contentService.getFAQs().catch(() => ({ faqs: [] })),
          contentService.getTestimonials().catch(() => ({ testimonials: [] }))
        ]);

        setFeaturedVehicles(vehiclesRes?.vehicles || []);
        setServices(servicesRes?.services || []);
        setFaqs(faqsRes?.faqs || []);
        setTestimonials(testimonialsRes?.testimonials || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
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
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Strip - Desktop Only */}
      <div className="hidden md:block">
        <TrustStrip />
      </div>

      {/* 3. Featured Fleet Section */}
      <section className="pt-36 sm:pt-44 md:pt-16 pb-16 sm:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
                Verified Fleet
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
                Featured Rental Vehicles
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Explore our most popular hatchbacks, sedans, SUVs, and passenger vans.
              </p>
            </div>
            <Link
              to="/fleet"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 font-bold text-sm text-brand-600 hover:text-brand-700 group"
            >
              <span>View All Fleet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => <VehicleCardSkeleton key={i} />)
            ) : featuredVehicles.length > 0 ? (
              featuredVehicles.slice(0, 6).map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-charcoal-800">Fleet list is being updated</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Please check back shortly or message us directly on WhatsApp.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-sm text-charcoal-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors shadow-subtle min-h-[48px]"
            >
              <Car className="w-4 h-4 text-brand-600" />
              <span>Browse Complete Fleet & Filter Rates</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip - Mobile Only (Positioned directly between Browse Fleet button and Our Rental Services) */}
      <div className="block md:hidden">
        <TrustStrip />
      </div>

      {/* 4. Rental Services Showcase */}
      <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
              Comprehensive Travel Solutions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-3">
              Our Rental Services
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              From self-drive freedom across Sri Lanka to luxury wedding cars and Katunayake airport transfers.
            </p>
          </div>

          {/* Swipeable cards on mobile (< md), responsive grid on desktop (md+) */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-4 md:pb-0">
            {services.map((srv, idx) => {
              const IconComp = serviceIcons[srv.iconName] || Car;
              return (
                <div
                  key={srv._id || idx}
                  className="w-[85vw] sm:w-[350px] md:w-auto shrink-0 md:shrink snap-center bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-subtle hover:border-brand-300 hover:shadow-card transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 border border-brand-100">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal-900 mb-2">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {srv.shortDescription}
                    </p>

                    {srv.features && srv.features.length > 0 && (
                      <ul className="space-y-2 mb-6 text-xs text-charcoal-700">
                        {srv.features.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 group pt-4 border-t border-gray-100"
                  >
                    <span>Learn More About This Service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex md:hidden items-center justify-center gap-1.5 text-[11px] font-semibold text-gray-400 mt-2">
            <span>← Swipe to explore all services →</span>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 7. Customer Reviews */}
      <ReviewsSection testimonials={testimonials} />

      {/* 8. FAQ Accordion */}
      <FaqAccordion faqs={faqs} />
    </main>
  );
};
