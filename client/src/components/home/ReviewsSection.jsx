import React from 'react';
import { Star, Info } from 'lucide-react';

export const ReviewsSection = ({ testimonials = [] }) => {
  // Default placeholder reviews if empty
  const displayReviews = testimonials.length > 0 ? testimonials : [
    {
      customerName: 'Saman Jayasinghe',
      locationOrCountry: 'Colombo, Sri Lanka',
      rating: 5,
      comment: 'Punctual airport handover and extremely clean Toyota Aqua. Transparent terms and prompt deposit return. Recommended for reliable travel in Sri Lanka.',
      vehicleRented: 'Toyota Aqua Hybrid',
      serviceType: 'Self Drive',
      isPlaceholder: true
    },
    {
      customerName: 'David & Sarah Jenkins',
      locationOrCountry: 'United Kingdom (Tourist)',
      rating: 5,
      comment: 'Our chauffeur for the 10-day cultural triangle tour was fantastic and very polite. The KDH van was spacious and comfortable for all our luggage.',
      vehicleRented: 'Toyota KDH Commuter Van',
      serviceType: 'With Driver',
      isPlaceholder: true
    },
    {
      customerName: 'Kavinda Perera',
      locationOrCountry: 'Negombo, Sri Lanka',
      rating: 5,
      comment: 'Hired the Suzuki Wagon R for 2 weeks. Fuel economy was great and the WhatsApp reservation was quick and hassle-free.',
      vehicleRented: 'Suzuki Wagon R Hybrid',
      serviceType: 'Self Drive',
      isPlaceholder: true
    }
  ];

  return (
    <section className="py-8 sm:py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            What Our Travellers Say
          </h2>
          
          {/* Transparent Notice Banner */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Sample Testimonials — genuine verified customer reviews are updated regularly.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {displayReviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-subtle flex flex-col justify-between"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-2.5">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-charcoal-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-charcoal-900">
                    {rev.customerName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {rev.locationOrCountry}
                  </p>
                </div>
                {rev.vehicleRented && (
                  <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
                    {rev.vehicleRented}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
