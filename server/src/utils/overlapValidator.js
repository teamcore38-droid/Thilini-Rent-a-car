import { Booking } from '../models/Booking.js';

/**
 * Checks whether a vehicle already has a Confirmed booking that overlaps with the requested date range.
 * Two intervals [A_start, A_end] and [B_start, B_end] overlap if:
 * A_start < B_end AND A_end > B_start
 * 
 * @param {string|mongoose.Types.ObjectId} vehicleId
 * @param {Date|string} pickupDateTime
 * @param {Date|string} returnDateTime
 * @param {string|mongoose.Types.ObjectId} [excludeBookingId] Optional booking ID to exclude (when editing existing booking)
 * @returns {Promise<{ hasOverlap: boolean, conflictingBooking: object|null }>}
 */
export const checkVehicleBookingOverlap = async (
  vehicleId,
  pickupDateTime,
  returnDateTime,
  excludeBookingId = null
) => {
  const pickup = new Date(pickupDateTime);
  const dropoff = new Date(returnDateTime);

  if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
    throw new Error('Invalid pickup or return date provided');
  }

  if (dropoff <= pickup) {
    throw new Error('Return date must be strictly after pickup date');
  }

  const query = {
    vehicle: vehicleId,
    status: { $in: ['Confirmed'] }, // Only Confirmed bookings lock availability
    $and: [
      { pickupDateTime: { $lt: dropoff } },
      { returnDateTime: { $gt: pickup } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query)
    .select('referenceNumber pickupDateTime returnDateTime status customerName')
    .lean();

  return {
    hasOverlap: !!conflictingBooking,
    conflictingBooking: conflictingBooking || null
  };
};
