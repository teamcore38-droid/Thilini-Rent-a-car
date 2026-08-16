import mongoose from 'mongoose';
import { VEHICLE_CATEGORIES, TRANSMISSION_TYPES, FUEL_TYPES, SERVICE_TYPES, VEHICLE_STATUSES } from '../config/constants.js';

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
      index: true
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
      index: true
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 2000,
      max: new Date().getFullYear() + 2
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: VEHICLE_CATEGORIES,
      index: true
    },
    transmission: {
      type: String,
      required: [true, 'Transmission is required'],
      enum: TRANSMISSION_TYPES,
      index: true
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: FUEL_TYPES,
      index: true
    },
    seats: {
      type: Number,
      required: [true, 'Seats count is required'],
      min: 1,
      max: 50,
      index: true
    },
    doors: {
      type: Number,
      default: 4,
      min: 2,
      max: 6
    },
    luggage: {
      type: Number,
      default: 2,
      min: 0,
      max: 20
    },
    hasAC: {
      type: Boolean,
      default: true
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    serviceTypes: [
      {
        type: String,
        enum: SERVICE_TYPES
      }
    ],
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate in LKR is required'],
      min: 0,
      index: true
    },
    weeklyRate: {
      type: Number,
      default: 0,
      min: 0
    },
    monthlyRate: {
      type: Number,
      default: 0,
      min: 0
    },
    deposit: {
      type: Number,
      default: 25000,
      min: 0
    },
    includedMileagePerDay: {
      type: Number,
      default: 100,
      min: 0
    },
    excessMileageRate: {
      type: Number,
      default: 75,
      min: 0
    },
    status: {
      type: String,
      enum: VEHICLE_STATUSES,
      default: 'available',
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for fast fleet filtering
vehicleSchema.index({ active: 1, status: 1, category: 1, dailyRate: 1 });
vehicleSchema.index({ active: 1, featured: 1 });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
