export const DEFAULT_SERVICE_TYPE = 'Self Drive';
export const CUSTOMER_SELECTED_LOCATION = 'Customer Selected Location';

export const BOOKING_SERVICE_TYPES = [
  'Self Drive',
  'With Driver',
  'Airport Transfer',
  'Wedding Hire',
  'Long-Term Rental'
];

export const DEFAULT_BOOKING_LOCATIONS = {
  officeLocation: 'Thilini Rent A Car Office',
  airportLocation: 'Bandaranaike International Airport (CMB - Katunayake)',
  defaultDeliveryLocation: 'Thilini Rent A Car Office',
  defaultHandoverLocation: 'Thilini Rent A Car Office',
  defaultPickupLocation: 'Thilini Rent A Car Office',
  defaultDropoffLocation: 'Thilini Rent A Car Office'
};

const SRI_LANKA_LOCATIONS = [
  'Colombo City (Fort / Kollupitiya / Bambalapitiya)',
  'Negombo Beach / City',
  'Kandy City Center',
  'Galle Fort / City',
  'Bentota / Beruwala',
  'Mirissa / Weligama',
  'Ella / Badulla',
  'Nuwara Eliya Town',
  'Sigiriya / Dambulla',
  'Trincomalee / Nilaveli',
  'Jaffna Town'
];

const configuredValue = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

export const getManagedBookingLocations = (settings = {}) => {
  const configured = settings.bookingLocations || {};
  const officeLocation = configuredValue(
    configured.officeLocation,
    DEFAULT_BOOKING_LOCATIONS.officeLocation
  );
  const airportLocation = configuredValue(
    configured.airportLocation,
    DEFAULT_BOOKING_LOCATIONS.airportLocation
  );

  return {
    officeLocation,
    airportLocation,
    defaultDeliveryLocation: configuredValue(
      configured.defaultDeliveryLocation,
      officeLocation
    ),
    defaultHandoverLocation: configuredValue(
      configured.defaultHandoverLocation,
      officeLocation
    ),
    defaultPickupLocation: configuredValue(
      configured.defaultPickupLocation,
      officeLocation
    ),
    defaultDropoffLocation: configuredValue(
      configured.defaultDropoffLocation,
      officeLocation
    )
  };
};

export const getBookingLocationOptions = (settings = {}) => {
  const managed = getManagedBookingLocations(settings);
  return [...new Set([
    managed.officeLocation,
    managed.airportLocation,
    managed.defaultDeliveryLocation,
    managed.defaultHandoverLocation,
    managed.defaultPickupLocation,
    managed.defaultDropoffLocation,
    ...SRI_LANKA_LOCATIONS,
    CUSTOMER_SELECTED_LOCATION
  ])];
};

export const getServiceLocationConfig = (serviceType, settings = {}) => {
  const managed = getManagedBookingLocations(settings);

  switch (serviceType) {
    case 'With Driver':
      return {
        startLabel: 'Pickup Location',
        endLabel: 'Drop-off Location',
        startDefault: managed.defaultPickupLocation,
        endDefault: managed.defaultDropoffLocation
      };
    case 'Airport Transfer':
      return {
        startLabel: 'Pickup Location',
        endLabel: 'Drop-off Location',
        startDefault: managed.airportLocation,
        endDefault: managed.airportLocation
      };
    case 'Wedding Hire':
    case 'Long-Term Rental':
      return {
        startLabel: 'Delivery Location',
        endLabel: 'Handover Location',
        startDefault: managed.defaultDeliveryLocation,
        endDefault: managed.defaultHandoverLocation
      };
    case 'Self Drive':
    default:
      return {
        startLabel: 'Delivery Location',
        endLabel: 'Return/Handover Location',
        startDefault: managed.defaultDeliveryLocation,
        endDefault: managed.defaultHandoverLocation
      };
  }
};

export const isIncompleteCustomLocation = (location) =>
  !location?.trim() || location === CUSTOMER_SELECTED_LOCATION;
