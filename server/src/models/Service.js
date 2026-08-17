import mongoose from '../config/mongoose.js';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    fullDescription: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: 'Car'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
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

serviceSchema.index({ active: 1, order: 1 });

export const Service = mongoose.model('Service', serviceSchema);
