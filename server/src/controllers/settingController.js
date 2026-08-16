import { Setting } from '../models/Setting.js';
import { DEFAULT_BUSINESS_SETTINGS } from '../config/constants.js';

// PUBLIC: Get public site settings
export const getPublicSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne().lean();

    if (!settings) {
      // Return fallback defaults if not seeded yet
      settings = DEFAULT_BUSINESS_SETTINGS;
    }

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update settings
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Business settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};
