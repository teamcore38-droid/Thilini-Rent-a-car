import mongoose from '../config/mongoose.js';

const settingSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: 'Thilini Rent A Car'
    },
    tagline: {
      type: String,
      default: 'Your Reliable Journey Starts Here'
    },
    supportingText: {
      type: String,
      default: 'Affordable and reliable self-drive, chauffeur-driven and airport rental services across Sri Lanka.'
    },
    phone: {
      type: String,
      default: '+94 77 123 4567'
    },
    whatsapp: {
      type: String,
      default: '+94 77 123 4567'
    },
    email: {
      type: String,
      default: 'info@thilinirentacar.com'
    },
    address: {
      type: String,
      default: 'No. 124, Negombo Road, Katunayake / Colombo, Sri Lanka'
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Bandaranaike+International+Airport+Katunayake'
    },
    businessHours: {
      type: String,
      default: 'Monday – Sunday: 24/7 Support & Airport Delivery Services'
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/thilinirentacar' },
      instagram: { type: String, default: 'https://instagram.com/thilinirentacar' },
      whatsapp: { type: String, default: 'https://wa.me/94771234567' }
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    standardDeposit: {
      type: Number,
      default: 25000
    },
    includedMileagePerDay: {
      type: Number,
      default: 100
    },
    excessMileageRate: {
      type: Number,
      default: 75
    },
    rentalTermsText: {
      type: String,
      default: ''
    },
    privacyPolicyText: {
      type: String,
      default: ''
    },
    isPlaceholder: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Setting = mongoose.model('Setting', settingSchema);
