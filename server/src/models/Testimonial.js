import mongoose from '../config/mongoose.js';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    locationOrCountry: {
      type: String,
      default: 'Sri Lanka',
      trim: true
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true
    },
    vehicleRented: {
      type: String,
      default: ''
    },
    serviceType: {
      type: String,
      default: 'Self Drive'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isPlaceholder: {
      type: Boolean,
      default: true // Marked as placeholder by default until genuine review verified
    },
    order: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

testimonialSchema.index({ active: 1, order: 1 });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
