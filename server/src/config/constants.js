export const VEHICLE_CATEGORIES = [
  'Economy',
  'Compact',
  'Sedan',
  'Hybrid',
  'SUV',
  'Van',
  'Luxury',
  'Wedding Vehicle'
];

export const TRANSMISSION_TYPES = ['Automatic', 'Manual'];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

export const SERVICE_TYPES = [
  'Self Drive',
  'With Driver',
  'Airport Transfer',
  'Wedding Hire',
  'Long-Term Rental'
];

export const VEHICLE_STATUSES = ['available', 'unavailable', 'booked', 'maintenance', 'archived'];

export const BOOKING_STATUSES = [
  'Pending',
  'Contacted',
  'Confirmed',
  'Completed',
  'Cancelled'
];

export const CONTACT_METHODS = ['WhatsApp', 'Phone', 'Email'];

export const SRI_LANKA_LOCATIONS = [
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
  'Trincomalee / Nilaveli',
  'Jaffna Town',
  'Custom Delivery (Islandwide)'
];

export const DEFAULT_BUSINESS_SETTINGS = {
  businessName: 'Thilini Rent A Car',
  tagline: 'Your Reliable Journey Starts Here',
  phone: '+94 77 123 4567',
  whatsapp: '+94 77 123 4567',
  email: 'info@thilinirentacar.com',
  address: 'No. 124, Negombo Road, Katunayake / Colombo, Sri Lanka',
  googleMapsUrl: 'https://maps.google.com/?q=Bandaranaike+International+Airport+Katunayake',
  businessHours: 'Monday – Sunday: 24/7 Support & Airport Delivery Services',
  socialLinks: {
    facebook: 'https://facebook.com/thilinirentacar',
    instagram: 'https://instagram.com/thilinirentacar',
    whatsapp: 'https://wa.me/94771234567'
  },
  currency: 'LKR',
  standardDeposit: 25000,
  includedMileagePerDay: 100,
  excessMileageRate: 75,
  isPlaceholder: true // Explicitly marked as unconfirmed until business replaces it
};
