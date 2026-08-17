import React, { useId } from 'react';
import { MapPin } from 'lucide-react';
import { CUSTOMER_SELECTED_LOCATION } from '../../config/bookingLocations';

export const BookingLocationSelect = ({ label, value, options, onChange }) => {
  const inputId = useId();
  const isPreset = options.includes(value) && value !== CUSTOMER_SELECTED_LOCATION;
  const selectedOption = isPreset ? value : CUSTOMER_SELECTED_LOCATION;
  const customValue = selectedOption === CUSTOMER_SELECTED_LOCATION && value !== CUSTOMER_SELECTED_LOCATION
    ? value
    : '';

  return (
    <div>
      <label
        htmlFor={`${inputId}-select`}
        className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5 flex items-center gap-1"
      >
        <MapPin className="w-3.5 h-3.5 text-brand-600" />
        <span>{label}</span>
      </label>
      <select
        id={`${inputId}-select`}
        value={selectedOption}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-charcoal-800 focus:ring-2 focus:ring-brand-600 min-h-[48px]"
      >
        {options.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      {selectedOption === CUSTOMER_SELECTED_LOCATION && (
        <input
          type="text"
          value={customValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          aria-label={`${label} details`}
          className="mt-2 w-full bg-white border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-charcoal-800 focus:ring-2 focus:ring-brand-600 min-h-[48px]"
          required
        />
      )}
    </div>
  );
};
