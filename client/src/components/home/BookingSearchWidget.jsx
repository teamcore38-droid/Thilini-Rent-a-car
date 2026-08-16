import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Car, AlertCircle } from 'lucide-react';

const SRI_LANKA_PICKUP_LOCATIONS = [
  'Bandaranaike International Airport (CMB - Katunayake)',
  'Colombo City (Fort / Kollupitiya / Bambalapitiya)',
  'Negombo Beach / City',
  'Kandy City Center',
  'Galle Fort / City',
  'Bentota / Beruwala',
  'Mirissa / Weligama',
  'Ella / Badulla',
  'Nuwara Eliya Town',
  'Sigiriya / Dambulla',
  'Custom Delivery (Islandwide)'
];

const SERVICE_OPTIONS = [
  'Self Drive',
  'With Driver',
  'Airport Transfer',
  'Wedding Hire',
  'Long-Term Rental'
];

const CATEGORY_OPTIONS = [
  'All Categories',
  'Economy',
  'Compact',
  'Sedan',
  'Hybrid',
  'SUV',
  'Van',
  'Luxury',
  'Wedding Vehicle'
];

export const BookingSearchWidget = ({ className = '' }) => {
  const navigate = useNavigate();

  // Tomorrow as default pickup, 4 days later as default return
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDefaultReturnStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  };

  const [serviceType, setServiceType] = useState('Self Drive');
  const [pickupLocation, setPickupLocation] = useState(SRI_LANKA_PICKUP_LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState(getTomorrowStr());
  const [returnDate, setReturnDate] = useState(getDefaultReturnStr());
  const [category, setCategory] = useState('All Categories');
  const [dateError, setDateError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (!pickupDate || !returnDate) {
      setDateError('Please select both pickup and return dates.');
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      setDateError('Return date must be strictly after pickup date.');
      return;
    }

    setDateError('');

    // Construct query parameters to prefill Fleet Page or Booking Flow
    const params = new URLSearchParams();
    if (serviceType) params.append('serviceType', serviceType);
    if (category && category !== 'All Categories') params.append('category', category);
    if (pickupLocation) params.append('pickupLocation', pickupLocation);
    if (pickupDate) params.append('pickupDate', pickupDate);
    if (returnDate) params.append('returnDate', returnDate);

    navigate(`/fleet?${params.toString()}`);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100/80 ${className}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. Service Type */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Service Type
            </label>
            <div className="relative">
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-charcoal-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-brand-600 p-2.5 min-h-[44px] font-medium"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Pickup Location */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Pickup Location</span>
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-charcoal-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-brand-600 p-2.5 min-h-[44px] font-medium"
            >
              {SRI_LANKA_PICKUP_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Pickup Date */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Pickup Date</span>
            </label>
            <input
              type="date"
              value={pickupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setPickupDate(e.target.value);
                setDateError('');
              }}
              className="w-full bg-gray-50 border border-gray-200 text-charcoal-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-brand-600 p-2.5 min-h-[44px] font-medium"
              required
            />
          </div>

          {/* 4. Return Date */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Return Date</span>
            </label>
            <input
              type="date"
              value={returnDate}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setReturnDate(e.target.value);
                setDateError('');
              }}
              className="w-full bg-gray-50 border border-gray-200 text-charcoal-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-brand-600 p-2.5 min-h-[44px] font-medium"
              required
            />
          </div>

          {/* 5. Vehicle Category */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-brand-600" />
              <span>Vehicle Class</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-charcoal-800 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-brand-600 focus:border-brand-600 p-2.5 min-h-[44px] font-medium"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Validation Alert */}
        {dateError && (
          <div className="flex items-center gap-2 p-2.5 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{dateError}</span>
          </div>
        )}

        {/* Submit Search Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            <span>Find Available Vehicles</span>
          </button>
        </div>
      </form>
    </div>
  );
};
