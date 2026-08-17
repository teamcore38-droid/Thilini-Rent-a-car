import { Vehicle } from '../models/Vehicle.js';
import {
  FUEL_TYPES,
  SERVICE_TYPES,
  TRANSMISSION_TYPES,
  VEHICLE_CATEGORIES,
  VEHICLE_STATUSES
} from '../config/constants.js';

export const VEHICLE_CARD_PROJECTION = {
  name: 1,
  slug: 1,
  make: 1,
  model: 1,
  year: 1,
  category: 1,
  transmission: 1,
  fuelType: 1,
  seats: 1,
  hasAC: 1,
  dailyRate: 1,
  weeklyRate: 1,
  monthlyRate: 1,
  status: 1,
  featured: 1,
  includedMileagePerDay: 1,
  images: {
    $slice: [
      {
        $concatArrays: [
          {
            $filter: {
              input: { $ifNull: ['$images', []] },
              as: 'image',
              cond: { $eq: ['$$image.isPrimary', true] }
            }
          },
          {
            $filter: {
              input: { $ifNull: ['$images', []] },
              as: 'image',
              cond: { $ne: ['$$image.isPrimary', true] }
            }
          }
        ]
      },
      1
    ]
  }
};

export const getCardVehicles = (query, sort, skip, limit) =>
  Vehicle.aggregate([
    { $match: query },
    { $sort: sort },
    ...(skip ? [{ $skip: skip }] : []),
    { $limit: limit },
    { $project: VEHICLE_CARD_PROJECTION }
  ]);

const normalizeSearch = (value) =>
  String(value || '')
    .slice(0, 64)
    .match(/[\p{L}\p{N}]+/gu)
    ?.join(' ')
    .trim() || '';

const parseEnumList = (value, allowed) => {
  if (!value) return null;
  const parsed = String(value).split(',').map((item) => item.trim()).filter(Boolean);
  return parsed.length > 0 && parsed.every((item) => allowed.includes(item)) ? parsed : false;
};

const badRequest = (res, message) => {
  res.set('Cache-Control', 'no-store');
  return res.status(400).json({
    success: false,
    code: 'INVALID_QUERY',
    message,
    requestId: res.req.requestId
  });
};

const generateSlug = (make, model, year) => {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// PUBLIC: Get active fleet with search, filters and pagination
export const getVehicles = async (req, res, next) => {
  try {
    const {
      search,
      category,
      transmission,
      fuelType,
      serviceType,
      seats,
      minPrice,
      maxPrice,
      status,
      sort = 'price_asc',
      page = 1,
      limit = 12,
      cacheVersion
    } = req.query;

    const allowedQueryParameters = new Set([
      'search', 'category', 'transmission', 'fuelType', 'serviceType', 'seats',
      'minPrice', 'maxPrice', 'status', 'sort', 'page', 'limit', 'cacheVersion'
    ]);
    if (Object.keys(req.query).some((key) => !allowedQueryParameters.has(key))) {
      return badRequest(res, 'Unsupported fleet query parameter.');
    }
    if (cacheVersion && !/^\d{1,20}$/.test(String(cacheVersion))) {
      return badRequest(res, 'Invalid cache version.');
    }

    const query = { active: true };

    if (status) {
      if (!VEHICLE_STATUSES.includes(status) || status === 'archived') {
        return badRequest(res, 'Invalid vehicle status.');
      }
      query.status = status;
    } else {
      // By default, show available and booked vehicles to allow advance bookings
      query.status = { $ne: 'archived' };
    }

    if (search) {
      const normalizedSearch = normalizeSearch(search);
      if (!normalizedSearch) return badRequest(res, 'Invalid search term.');
      query.$text = { $search: normalizedSearch };
    }

    if (category) {
      const categories = parseEnumList(category, VEHICLE_CATEGORIES);
      if (!categories) return badRequest(res, 'Invalid vehicle category.');
      query.category = { $in: categories };
    }

    if (transmission) {
      if (!TRANSMISSION_TYPES.includes(transmission)) {
        return badRequest(res, 'Invalid transmission type.');
      }
      query.transmission = transmission;
    }

    if (fuelType) {
      const fuels = parseEnumList(fuelType, FUEL_TYPES);
      if (!fuels) return badRequest(res, 'Invalid fuel type.');
      query.fuelType = { $in: fuels };
    }

    if (serviceType) {
      if (!SERVICE_TYPES.includes(serviceType)) return badRequest(res, 'Invalid service type.');
      query.serviceTypes = serviceType;
    }

    if (seats) {
      if (!/^\d+$/.test(String(seats))) return badRequest(res, 'Invalid seat count.');
      const parsedSeats = parseInt(seats, 10);
      if (!Number.isInteger(parsedSeats) || parsedSeats < 1 || parsedSeats > 50) {
        return badRequest(res, 'Invalid seat count.');
      }
      if (!isNaN(parsedSeats)) {
        if (parsedSeats >= 7) {
          query.seats = { $gte: 7 };
        } else {
          query.seats = parsedSeats;
        }
      }
    }

    if (minPrice || maxPrice) {
      const parsedMinPrice = minPrice ? Number(minPrice) : null;
      const parsedMaxPrice = maxPrice ? Number(maxPrice) : null;
      if (
        (parsedMinPrice !== null && (!Number.isFinite(parsedMinPrice) || parsedMinPrice < 0)) ||
        (parsedMaxPrice !== null && (!Number.isFinite(parsedMaxPrice) || parsedMaxPrice < 0)) ||
        (parsedMinPrice !== null && parsedMaxPrice !== null && parsedMinPrice > parsedMaxPrice)
      ) {
        return badRequest(res, 'Invalid price range.');
      }
      query.dailyRate = {};
      if (parsedMinPrice !== null) query.dailyRate.$gte = parsedMinPrice;
      if (parsedMaxPrice !== null) query.dailyRate.$lte = parsedMaxPrice;
    }

    const sortMap = {
      price_asc: { dailyRate: 1, _id: 1 },
      price_desc: { dailyRate: -1, _id: 1 },
      year_desc: { year: -1, _id: 1 },
      name_asc: { name: 1, _id: 1 }
    };
    if (!sortMap[sort]) return badRequest(res, 'Invalid sort option.');
    const sortOptions = sortMap[sort];

    if (!/^\d+$/.test(String(page)) || !/^\d+$/.test(String(limit))) {
      return badRequest(res, 'Invalid pagination parameters.');
    }
    const pageNum = Math.max(1, parseInt(page, 10));
    // Bound public payloads while still supporting the 50-item booking selector.
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [vehicles, total] = await Promise.all([
      getCardVehicles(query, sortOptions, skip, limitNum),
      Vehicle.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      vehicles
    });
  } catch (error) {
    console.error('[Vehicle Query Error]:', error.message);
    if (
      error.name === 'MongooseServerSelectionError' ||
      error.name === 'MongoNetworkError' ||
      error.name === 'MongooseError'
    ) {
      res.set('Cache-Control', 'no-store');
      return res.status(503).json({
        success: false,
        code: 'DATABASE_UNAVAILABLE',
        message: 'The service is temporarily unavailable. Please try again shortly.',
        requestId: req.requestId,
        count: 0,
        total: 0,
        totalPages: 1,
        currentPage: 1,
        vehicles: []
      });
    }
    next(error);
  }
};

// PUBLIC: Get 6 featured vehicles for Homepage
export const getFeaturedVehicles = async (req, res, next) => {
  try {
    // Sorting featured vehicles first preserves the previous behavior in one query.
    const featured = await getCardVehicles(
      { active: true, status: { $ne: 'archived' } },
      { featured: -1, dailyRate: 1, _id: 1 },
      0,
      6
    );

    res.status(200).json({
      success: true,
      vehicles: featured
    });
  } catch (error) {
    console.error('[Featured Vehicles Error]:', error.message);
    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      success: true,
      vehicles: []
    });
  }
};

// PUBLIC: Get single vehicle by slug
export const getVehicleBySlug = async (req, res, next) => {
  try {
    if (!/^[a-z0-9-]{1,120}$/.test(req.params.slug)) {
      return badRequest(res, 'Invalid vehicle identifier.');
    }
    const vehicle = await Vehicle.findOne({
      slug: req.params.slug,
      active: true,
      status: { $ne: 'archived' }
    }).lean();

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or currently unavailable'
      });
    }

    res.status(200).json({
      success: true,
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Get similar vehicles by category
export const getSimilarVehicles = async (req, res, next) => {
  try {
    if (Object.keys(req.query).some((key) => !['category', 'excludeSlug', 'limit'].includes(key))) {
      return badRequest(res, 'Unsupported similar vehicle query parameter.');
    }
    const { category, excludeSlug = '' } = req.query;
    const rawLimit = String(req.query.limit || '3');
    if (!/^\d+$/.test(rawLimit)) return badRequest(res, 'Invalid similar vehicle limit.');
    const limit = Math.min(6, Math.max(1, Number.parseInt(rawLimit, 10)));

    if (!VEHICLE_CATEGORIES.includes(category)) {
      return badRequest(res, 'Invalid vehicle category.');
    }
    if (excludeSlug && !/^[a-z0-9-]{1,120}$/.test(excludeSlug)) {
      return badRequest(res, 'Invalid excluded vehicle identifier.');
    }

    const query = {
      category,
      active: true,
      status: { $ne: 'archived' }
    };
    if (excludeSlug) query.slug = { $ne: excludeSlug };

    const similar = await getCardVehicles(query, { featured: -1, dailyRate: 1, _id: 1 }, 0, limit);

    res.status(200).json({
      success: true,
      vehicles: similar
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all vehicles with admin details
export const getAdminVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Create vehicle
export const createVehicle = async (req, res, next) => {
  try {
    const { make, model, year } = req.body;
    let baseSlug = req.body.slug || generateSlug(make, model, year);

    // Check slug collision
    let slug = baseSlug;
    let count = 1;
    while (await Vehicle.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const vehicle = await Vehicle.create({
      ...req.body,
      slug
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update vehicle
export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Soft delete or archive vehicle
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Soft delete: set active = false and status = 'archived' to preserve booking history
    vehicle.active = false;
    vehicle.status = 'archived';
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle archived successfully'
    });
  } catch (error) {
    next(error);
  }
};
