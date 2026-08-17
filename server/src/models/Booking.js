import mongoose from '../config/mongoose.js';
import { SERVICE_TYPES, BOOKING_STATUSES, CONTACT_METHODS } from '../config/constants.js';

const bookingSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index: true
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: SERVICE_TYPES
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true
    },
    dropoffLocation: {
      type: String,
      required: [true, 'Drop-off location is required'],
      trim: true
    },
    pickupDateTime: {
      type: Date,
      required: [true, 'Pickup date and time is required'],
      index: true
    },
    returnDateTime: {
      type: Date,
      required: [true, 'Return date and time is required'],
      index: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    country: {
      type: String,
      default: 'Sri Lanka',
      trim: true
    },
    passengerCount: {
      type: Number,
      default: 1,
      min: 1
    },
    flightNumber: {
      type: String,
      trim: true,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    preferredContactMethod: {
      type: String,
      enum: CONTACT_METHODS,
      default: 'WhatsApp'
    },
    estimatedPrice: {
      type: Number,
      default: 0
    },
    isEstimatedPriceAccurate: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'Pending',
      index: true
    },
    adminNotes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound index for overlap checking on active/confirmed bookings
bookingSchema.index({ vehicle: 1, status: 1, pickupDateTime: 1, returnDateTime: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
