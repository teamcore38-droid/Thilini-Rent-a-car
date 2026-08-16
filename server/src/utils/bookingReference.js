import { Booking } from '../models/Booking.js';

/**
 * Generates human-readable reference number such as TRC-2026-0001
 */
export const generateBookingReference = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `TRC-${currentYear}`;

  // Find the highest reference number for the current year
  const lastBooking = await Booking.findOne({
    referenceNumber: new RegExp(`^${prefix}-`)
  })
    .sort({ referenceNumber: -1 })
    .select('referenceNumber')
    .lean();

  let nextSequence = 1;

  if (lastBooking && lastBooking.referenceNumber) {
    const parts = lastBooking.referenceNumber.split('-');
    if (parts.length === 3) {
      const parsedSeq = parseInt(parts[2], 10);
      if (!isNaN(parsedSeq)) {
        nextSequence = parsedSeq + 1;
      }
    }
  }

  const paddedSequence = String(nextSequence).padStart(4, '0');
  return `${prefix}-${paddedSequence}`;
};
