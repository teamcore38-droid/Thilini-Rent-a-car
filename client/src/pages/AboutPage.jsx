import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Users, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { TrustStrip } from '../components/common/TrustStrip';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Our Story & Values
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal-900 mt-3">
            About Thilini Rent A Car
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            A trusted Sri Lankan vehicle rental service dedicated to transparency, vehicle reliability, and genuine local hospitality.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200 shadow-subtle mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 text-charcoal-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl font-extrabold text-charcoal-900">
              Reliable Journeys Across Sri Lanka
            </h2>
            <p>
              At <strong>Thilini Rent A Car</strong>, we believe renting a vehicle in Sri Lanka should be simple, honest, and stress-free. Whether you are an international tourist discovering the Hill Country, an expatriate visiting family, or a local business executive requiring dependable transport, we provide vehicles suited to your exact schedule and budget.
            </p>
            <p>
              We operate with full pricing clarity. All our rates in Sri Lankan Rupees (LKR) are published transparently, and we never impose hidden surcharges on vehicle return.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 text-xs font-bold text-charcoal-900">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-Point Inspections</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent Deposits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Airport Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Courteous Chauffeurs</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] shadow-md border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80"
              alt="Thilini Rent A Car fleet in Sri Lanka"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">Fleet Safety & Maintenance</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every car undergoes regular mechanical servicing, brake checks, tire inspection, and thorough sanitization before handover.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">Genuine Sri Lankan Hospitality</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our team takes pride in guiding you with honest route recommendations, airport coordination, and quick WhatsApp communication.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-charcoal-900 mb-2">Islandwide Reach</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Based conveniently near Bandaranaike International Airport (CMB) and Colombo, delivering vehicles across all major districts.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center bg-brand-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Ready to Explore Sri Lanka with Us?
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto mb-6">
            View our full range of well-maintained vehicles and send a booking request in less than 2 minutes.
          </p>
          <Link
            to="/fleet"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 hover:bg-gray-100 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all min-h-[44px]"
          >
            <span>Explore Vehicle Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
