import { body, validationResult } from 'express-validator';
import { VEHICLE_CATEGORIES, TRANSMISSION_TYPES, FUEL_TYPES, SERVICE_TYPES } from '../config/constants.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

export const bookingValidationRules = [
  body('vehicle')
    .notEmpty()
    .withMessage('Vehicle selection is required')
    .isMongoId()
    .withMessage('Invalid vehicle identifier'),
  body('serviceType')
    .notEmpty()
    .withMessage('Service type is required')
    .isIn(SERVICE_TYPES)
    .withMessage('Invalid service type selected'),
  body('pickupLocation')
    .trim()
    .notEmpty()
    .withMessage('Pickup location is required'),
  body('dropoffLocation')
    .trim()
    .notEmpty()
    .withMessage('Drop-off location is required'),
  body('pickupDateTime')
    .notEmpty()
    .withMessage('Pickup date and time is required')
    .isISO8601()
    .withMessage('Invalid pickup date format')
    .custom((value) => {
      const pickupDate = new Date(value);
      // Allow slight clock variance of 2 hours
      const now = new Date(Date.now() - 2 * 60 * 60 * 1000);
      if (pickupDate < now) {
        throw new Error('Pickup date cannot be in the past');
      }
      return true;
    }),
  body('returnDateTime')
    .notEmpty()
    .withMessage('Return date and time is required')
    .isISO8601()
    .withMessage('Invalid return date format')
    .custom((value, { req }) => {
      const pickupDate = new Date(req.body.pickupDateTime);
      const returnDate = new Date(value);
      if (returnDate <= pickupDate) {
        throw new Error('Return date must be strictly after the pickup date');
      }
      return true;
    }),
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone number is required')
    .matches(/^(\+?[0-9\s\-()]{7,20})$/)
    .withMessage('Please enter a valid phone number (e.g., +94 77 123 4567 or local format)'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('passengerCount')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Passenger count must be at least 1')
];

export const vehicleValidationRules = [
  body('name').trim().notEmpty().withMessage('Vehicle name is required'),
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 2000, max: new Date().getFullYear() + 2 }).withMessage('Valid year is required'),
  body('category').isIn(VEHICLE_CATEGORIES).withMessage('Invalid vehicle category'),
  body('transmission').isIn(TRANSMISSION_TYPES).withMessage('Invalid transmission type'),
  body('fuelType').isIn(FUEL_TYPES).withMessage('Invalid fuel type'),
  body('seats').isInt({ min: 1, max: 50 }).withMessage('Seats must be between 1 and 50'),
  body('dailyRate').isFloat({ min: 0 }).withMessage('Daily rate must be a positive number')
];

export const loginValidationRules = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];
