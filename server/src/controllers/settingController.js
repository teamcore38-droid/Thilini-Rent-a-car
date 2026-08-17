import { Setting } from '../models/Setting.js';
import { DEFAULT_BUSINESS_SETTINGS } from '../config/constants.js';

// PUBLIC: Get public site settings (resilient with fallback defaults)
export const getPublicSettings = async (req, res, next) => {
  try {
    let settings = null;
    try {
      settings = await Setting.findOne().lean();
    } catch (dbErr) {
      console.warn('[Settings Notice]: Using default fallback settings while DB connects:', dbErr.message);
    }

    if (!settings) {
      settings = DEFAULT_BUSINESS_SETTINGS;
    }

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    // Fail-safe: Always return 200 with default business settings to prevent frontend crash
    res.status(200).json({
      success: true,
      settings: DEFAULT_BUSINESS_SETTINGS
    });
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
