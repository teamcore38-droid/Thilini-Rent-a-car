import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Fuel, Gauge, Wind, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const VehicleCard = ({ vehicle }) => {
  const { formatCurrency, getWhatsAppUrl } = useSettings();

  if (!vehicle) return null;

  const primaryImage =
    vehicle.images?.find((img) => img.isPrimary)?.url ||
    vehicle.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  const isAvailable = vehicle.status === 'available';

  const preFilledWhatsApp = getWhatsAppUrl(
    `Hello Thilini Rent A Car! I am interested in renting the *${vehicle.name}* (${vehicle.year || ''}) - Daily Rate: ${formatCurrency(vehicle.dailyRate)}. Is it available?`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={primaryImage}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/95 text-charcoal-800 shadow-sm backdrop-blur-sm">
          {vehicle.category}
        </span>

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm flex items-center gap-1 ${
            isAvailable
              ? 'bg-emerald-500/90 text-white'
              : vehicle.status === 'booked'
              ? 'bg-amber-500/90 text-white'
              : 'bg-gray-500/90 text-white'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          {isAvailable ? 'Available' : vehicle.status === 'booked' ? 'Advance Booking' : 'Reserved'}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Make & Model Title */}
          <h3 className="font-extrabold text-lg text-charcoal-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {vehicle.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {vehicle.year ? `${vehicle.year} Model • ` : ''}Thilini Rent A Car Fleet
          </p>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 my-3.5 pt-3 border-t border-gray-100 text-xs text-charcoal-700">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Gauge className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Fuel className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Users className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Wind className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>{vehicle.hasAC ? 'Air Conditioned' : 'Non A/C'}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-gray-500 uppercase font-semibold block">
                Starting Rate
              </span>
              <span className="text-xl font-black text-brand-600">
                {formatCurrency(vehicle.dailyRate)}
              </span>
              <span className="text-xs text-gray-500 font-medium ml-1">/ day</span>
            </div>
            {vehicle.includedMileagePerDay && (
              <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-1 rounded font-medium">
                {vehicle.includedMileagePerDay} km/day incl.
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* View Details Button */}
            <Link
              to={`/fleet/${vehicle.slug}`}
              className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs font-bold text-charcoal-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[44px]"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-charcoal-600" />
            </Link>

            {/* WhatsApp Enquiry Button */}
            <a
              href={preFilledWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm min-h-[44px]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Enquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
