const RATE_DEFINITIONS = [
  { id: 'month', label: 'Month', field: 'monthlyRate', suffix: '/ month' },
  { id: 'week', label: 'Week', field: 'weeklyRate', suffix: '/ week' },
  { id: 'day', label: 'Day', field: 'dailyRate', suffix: '/ day' }
];

export const getAvailableVehicleRates = (vehicle = {}) =>
  RATE_DEFINITIONS.flatMap((definition) => {
    const amount = Number(vehicle[definition.field]);
    return Number.isFinite(amount) && amount > 0
      ? [{ ...definition, amount }]
      : [];
  });

export const getSelectedVehicleRate = (rates, selectedPeriod) =>
  rates.find((rate) => rate.id === selectedPeriod) || rates[0] || null;
