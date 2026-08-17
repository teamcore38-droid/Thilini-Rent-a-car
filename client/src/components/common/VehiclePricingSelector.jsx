import React, { useState } from 'react';
import {
  getAvailableVehicleRates,
  getSelectedVehicleRate
} from '../../utils/vehicleRates';

export const VehiclePricingSelector = ({ vehicle, formatCurrency }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const availableRates = getAvailableVehicleRates(vehicle);
  const selectedRate = getSelectedVehicleRate(availableRates, selectedPeriod);

  if (!selectedRate) {
    return (
      <div className="min-w-0">
        <span className="text-[11px] text-gray-500 uppercase font-semibold block">
          Rental Rate
        </span>
        <span className="text-sm font-bold text-charcoal-800">Rate on request</span>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div
        className="inline-flex items-center rounded-lg bg-gray-100 p-0.5"
        role="group"
        aria-label="Rental duration"
      >
        {availableRates.map((rate) => {
          const isSelected = rate.id === selectedRate.id;
          return (
            <button
              key={rate.id}
              type="button"
              onClick={() => setSelectedPeriod(rate.id)}
              className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase leading-none transition-colors ${
                isSelected
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-500 hover:text-charcoal-800'
              }`}
              aria-label={`Show ${rate.label.toLowerCase()} rate`}
              aria-pressed={isSelected}
            >
              {rate.label}
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-baseline whitespace-nowrap">
        <span className="text-xl font-black text-brand-600">
          {formatCurrency(selectedRate.amount)}
        </span>
        <span className="ml-1 text-xs font-medium text-gray-500">
          {selectedRate.suffix}
        </span>
      </div>
    </div>
  );
};
