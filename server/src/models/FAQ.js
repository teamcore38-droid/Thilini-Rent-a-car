import mongoose from '../config/mongoose.js';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true
    },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Documents & Licences', 'Rates & Deposits', 'Mileage & Fuel', 'Airport & Delivery', 'Cancellations']
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

faqSchema.index({ active: 1, category: 1, order: 1 });

export const FAQ = mongoose.model('FAQ', faqSchema);
