import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingService } from '../services/settingService';

const defaultSettings = {
  businessName: 'Thilini Rent A Car',
  tagline: 'Your Reliable Journey Starts Here',
  supportingText: 'Affordable and reliable self-drive, chauffeur-driven and airport rental services across Sri Lanka.',
  phone: '+94 77 123 4567',
  whatsapp: '+94 77 123 4567',
  email: 'info@thilinirentacar.com',
  address: 'No. 124, Negombo Road, Katunayake / Colombo, Sri Lanka',
  googleMapsUrl: 'https://maps.google.com/?q=Bandaranaike+International+Airport+Katunayake',
  businessHours: 'Monday – Sunday: 24/7 Support & Airport Delivery Services',
  socialLinks: {
    facebook: 'https://facebook.com/thilinirentacar',
    instagram: 'https://instagram.com/thilinirentacar',
    whatsapp: 'https://wa.me/94771234567'
  },
  currency: 'LKR',
  standardDeposit: 25000,
  includedMileagePerDay: 100,
  excessMileageRate: 75,
  isPlaceholder: true
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await settingService.getSettings();
      if (data?.settings) {
        setSettings(data.settings);
      }
    } catch {
      // Use fallback defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newData) => {
    const data = await settingService.updateSettings(newData);
    if (data?.settings) {
      setSettings(data.settings);
    }
    return data;
  };

  // Helper to format LKR currency amounts e.g., "LKR 12,000"
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return `${settings.currency || 'LKR'} 0`;
    return `${settings.currency || 'LKR'} ${amount.toLocaleString('en-LK')}`;
  };

  // Helper to clean phone numbers for tel: and wa.me links
  const getCleanPhone = (phoneStr) => {
    return (phoneStr || settings.phone || '').replace(/[^0-9+]/g, '');
  };

  const getWhatsAppUrl = (customMessage = '') => {
    const cleanNumber = (settings.whatsapp || '94771234567').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(
      customMessage ||
        'Hello Thilini Rent A Car! I would like to make an enquiry about car rental services.'
    );
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings: fetchSettings,
        formatCurrency,
        getCleanPhone,
        getWhatsAppUrl
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
