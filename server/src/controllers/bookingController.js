import { Booking } from '../models/Booking.js';
import { Vehicle } from '../models/Vehicle.js';
import { generateBookingReference } from '../utils/bookingReference.js';
import { checkVehicleBookingOverlap } from '../utils/overlapValidator.js';

// Helper to calculate rental days and estimated cost
const calculateEstimatedCost = (vehicle, pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const diffTime = Math.abs(returnD - pickup);
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (vehicle && vehicle.dailyRate > 0) {
    let cost = diffDays * vehicle.dailyRate;
    return {
      days: diffDays,
      estimatedPrice: cost,
      isAccurate: true
    };
  }

  return {
    days: diffDays,
    estimatedPrice: 0,
    isAccurate: false
  };
};

// PUBLIC: Check vehicle availability for given dates
export const checkAvailability = async (req, res, next) => {
  try {
    const { vehicleId, pickupDateTime, returnDateTime } = req.body;

    if (!vehicleId || !pickupDateTime || !returnDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID, pickup date and return date are required.'
      });
    }

    const { hasOverlap, conflictingBooking } = await checkVehicleBookingOverlap(
      vehicleId,
      pickupDateTime,
      returnDateTime
    );

    res.status(200).json({
      success: true,
      isAvailable: !hasOverlap,
      message: hasOverlap
        ? 'Selected vehicle has a confirmed booking during these dates. Please choose different dates or vehicles.'
        : 'Vehicle is currently available for these dates.'
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Submit 3-Step Booking Request
export const createBooking = async (req, res, next) => {
  try {
    const {
      vehicle: vehicleId,
      serviceType,
      pickupLocation,
      dropoffLocation,
      pickupDateTime,
      returnDateTime,
      customerName,
      phone,
      email,
      country = 'Sri Lanka',
      passengerCount = 1,
      flightNumber = '',
      notes = '',
      preferredContactMethod = 'WhatsApp'
    } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.active) {
      return res.status(404).json({
        success: false,
        message: 'Selected vehicle is not available.'
      });
    }

    // Check for confirmed date overlap
    const { hasOverlap } = await checkVehicleBookingOverlap(
      vehicleId,
      pickupDateTime,
      returnDateTime
    );

    if (hasOverlap) {
      return res.status(409).json({
        success: false,
        message: 'Vehicle is already confirmed for another customer during these dates. Please select alternative dates or a similar vehicle.'
      });
    }

    // Generate human-readable reference number (TRC-YYYY-XXXX)
    const referenceNumber = await generateBookingReference();

    // Calculate estimated price
    const { estimatedPrice, isAccurate, days } = calculateEstimatedCost(
      vehicle,
      pickupDateTime,
      returnDateTime
    );

    const booking = await Booking.create({
      referenceNumber,
      vehicle: vehicleId,
      serviceType,
      pickupLocation,
      dropoffLocation,
      pickupDateTime,
      returnDateTime,
      customerName,
      phone,
      email,
      country,
      passengerCount,
      flightNumber,
      notes,
      preferredContactMethod,
      estimatedPrice,
      isEstimatedPriceAccurate: isAccurate,
      status: 'Pending'
    });

    // Generate pre-filled WhatsApp message URL
    const pickupFormatted = new Date(pickupDateTime).toLocaleString('en-US', {
      timeZone: 'Asia/Colombo',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const returnFormatted = new Date(returnDateTime).toLocaleString('en-US', {
      timeZone: 'Asia/Colombo',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const whatsappMessage = encodeURIComponent(
      `Hello Thilini Rent A Car! I have submitted booking request *${referenceNumber}*.\n\n` +
      `🚗 *Vehicle:* ${vehicle.name}\n` +
      `🛠 *Service:* ${serviceType}\n` +
      `📍 *Pickup:* ${pickupLocation}\n` +
      `📍 *Drop-off:* ${dropoffLocation}\n` +
      `📅 *Pickup Time:* ${pickupFormatted}\n` +
      `📅 *Return Time:* ${returnFormatted}\n` +
      `👤 *Name:* ${customerName}\n` +
      `📞 *Phone:* ${phone}\n` +
      (flightNumber ? `✈️ *Flight #:* ${flightNumber}\n` : '') +
      `\nPlease confirm availability and total rate. Thank you!`
    );

    const whatsappNumber = process.env.VITE_WHATSAPP_NUMBER || '94771234567';
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

    res.status(201).json({
      success: true,
      message: 'Your booking request has been submitted successfully with Pending status.',
      booking: {
        referenceNumber: booking.referenceNumber,
        status: booking.status,
        customerName: booking.customerName,
        serviceType: booking.serviceType,
        pickupDateTime: booking.pickupDateTime,
        returnDateTime: booking.returnDateTime,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        estimatedPrice: booking.estimatedPrice,
        isEstimatedPriceAccurate: booking.isEstimatedPriceAccurate,
        rentalDays: days,
        createdAt: booking.createdAt
      },
      whatsappUrl
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Quick reference lookup (sanitized for privacy)
export const lookupBooking = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const booking = await Booking.findOne({ referenceNumber: reference.toUpperCase() })
      .populate('vehicle', 'name make model category dailyRate images')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No booking found with this reference number.'
      });
    }

    // Mask phone number for privacy
    const maskedPhone = booking.phone ? booking.phone.replace(/.(?=.{4})/g, '*') : '';

    res.status(200).json({
      success: true,
      booking: {
        referenceNumber: booking.referenceNumber,
        status: booking.status,
        serviceType: booking.serviceType,
        customerName: booking.customerName,
        phone: maskedPhone,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        pickupDateTime: booking.pickupDateTime,
        returnDateTime: booking.returnDateTime,
        vehicle: booking.vehicle,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all bookings with filtering, search, and pagination
export const getAdminBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15, fromDate, toDate } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (fromDate || toDate) {
      query.pickupDateTime = {};
      if (fromDate) query.pickupDateTime.$gte = new Date(fromDate);
      if (toDate) query.pickupDateTime.$lte = new Date(toDate);
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('vehicle', 'name make model category dailyRate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Booking.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get single booking details
export const getAdminBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update booking status, assign vehicle, add admin notes
export const updateAdminBooking = async (req, res, next) => {
  try {
    const { status, adminNotes, vehicle: newVehicleId, pickupDateTime, returnDateTime } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const targetVehicleId = newVehicleId || booking.vehicle;
    const targetPickup = pickupDateTime || booking.pickupDateTime;
    const targetReturn = returnDateTime || booking.returnDateTime;

    // If changing status to 'Confirmed', ensure no overlap with other confirmed bookings
    if (status === 'Confirmed' || (booking.status === 'Confirmed' && (newVehicleId || pickupDateTime || returnDateTime))) {
      const { hasOverlap, conflictingBooking } = await checkVehicleBookingOverlap(
        targetVehicleId,
        targetPickup,
        targetReturn,
        booking._id
      );

      if (hasOverlap) {
        return res.status(409).json({
          success: false,
          message: `Cannot confirm booking: Vehicle has an overlapping confirmed booking (${conflictingBooking.referenceNumber}).`
        });
      }
    }

    if (status) booking.status = status;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    if (newVehicleId) booking.vehicle = newVehicleId;
    if (pickupDateTime) booking.pickupDateTime = pickupDateTime;
    if (returnDateTime) booking.returnDateTime = returnDateTime;

    await booking.save();

    const updated = await Booking.findById(booking._id).populate('vehicle');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking: updated
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Export bookings as CSV
export const exportBookingsCSV = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle', 'name make model')
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      'Reference',
      'Status',
      'Customer Name',
      'Phone',
      'Email',
      'Vehicle',
      'Service Type',
      'Pickup Location',
      'Dropoff Location',
      'Pickup Date',
      'Return Date',
      'Estimated Price LKR',
      'Flight Number',
      'Created At'
    ];

    const rows = bookings.map((b) => [
      `"${b.referenceNumber || ''}"`,
      `"${b.status || ''}"`,
      `"${(b.customerName || '').replace(/"/g, '""')}"`,
      `"${b.phone || ''}"`,
      `"${b.email || ''}"`,
      `"${(b.vehicle?.name || '').replace(/"/g, '""')}"`,
      `"${b.serviceType || ''}"`,
      `"${(b.pickupLocation || '').replace(/"/g, '""')}"`,
      `"${(b.dropoffLocation || '').replace(/"/g, '""')}"`,
      `"${b.pickupDateTime ? new Date(b.pickupDateTime).toISOString() : ''}"`,
      `"${b.returnDateTime ? new Date(b.returnDateTime).toISOString() : ''}"`,
      `"${b.estimatedPrice || 0}"`,
      `"${b.flightNumber || ''}"`,
      `"${b.createdAt ? new Date(b.createdAt).toISOString() : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="thilini-bookings-${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Dashboard KPI Statistics
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      availableVehicles,
      maintenanceVehicles,
      pendingRequests,
      confirmedBookings,
      recentBookings
    ] = await Promise.all([
      Vehicle.countDocuments({ status: { $ne: 'archived' } }),
      Vehicle.countDocuments({ status: 'available', active: true }),
      Vehicle.countDocuments({ status: 'maintenance' }),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.find()
        .populate('vehicle', 'name category dailyRate images')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean()
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalVehicles,
        availableVehicles,
        maintenanceVehicles,
        pendingRequests,
        confirmedBookings
      },
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};
