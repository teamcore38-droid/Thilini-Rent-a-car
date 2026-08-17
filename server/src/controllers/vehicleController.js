import { Vehicle } from '../models/Vehicle.js';

const VEHICLE_CARD_FIELDS =
  'name slug make model year category transmission fuelType seats hasAC images dailyRate status includedMileagePerDay';

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
      limit = 12
    } = req.query;

    const query = { active: true };

    if (status) {
      query.status = status;
    } else {
      // By default, show available and booked vehicles to allow advance bookings
      query.status = { $ne: 'archived' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      const categories = category.split(',').map((c) => c.trim());
      query.category = { $in: categories };
    }

    if (transmission) {
      query.transmission = transmission;
    }

    if (fuelType) {
      const fuels = fuelType.split(',').map((f) => f.trim());
      query.fuelType = { $in: fuels };
    }

    if (serviceType) {
      query.serviceTypes = serviceType;
    }

    if (seats) {
      const parsedSeats = parseInt(seats, 10);
      if (!isNaN(parsedSeats)) {
        if (parsedSeats >= 7) {
          query.seats = { $gte: 7 };
        } else {
          query.seats = parsedSeats;
        }
      }
    }

    if (minPrice || maxPrice) {
      query.dailyRate = {};
      if (minPrice) query.dailyRate.$gte = Number(minPrice);
      if (maxPrice) query.dailyRate.$lte = Number(maxPrice);
    }

    let sortOptions = { dailyRate: 1 };
    if (sort === 'price_desc') sortOptions = { dailyRate: -1 };
    if (sort === 'year_desc') sortOptions = { year: -1 };
    if (sort === 'name_asc') sortOptions = { name: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    // Bound public payloads while still supporting the 50-item booking selector.
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .select(VEHICLE_CARD_FIELDS)
        .lean(),
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
    if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoNetworkError') {
      res.set('Cache-Control', 'no-store');
      return res.status(503).json({
        success: false,
        message: 'Database connection in progress. Please retry.',
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
    const featured = await Vehicle.find({
      active: true,
      status: { $ne: 'archived' }
    })
      .sort({ featured: -1, dailyRate: 1 })
      .limit(6)
      .select(VEHICLE_CARD_FIELDS)
      .lean();

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
    const { slug } = req.params;
    const currentVehicle = await Vehicle.findOne({ slug }).lean();

    if (!currentVehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    const similar = await Vehicle.find({
      _id: { $ne: currentVehicle._id },
      category: currentVehicle.category,
      active: true,
      status: { $ne: 'archived' }
    })
      .limit(3)
      .lean();

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
