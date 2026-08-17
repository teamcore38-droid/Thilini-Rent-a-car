import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

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
  bookingLocations: {
    officeLocation: 'Thilini Rent A Car Office',
    airportLocation: 'Bandaranaike International Airport (CMB - Katunayake)',
    defaultDeliveryLocation: 'Thilini Rent A Car Office',
    defaultHandoverLocation: 'Thilini Rent A Car Office',
    defaultPickupLocation: 'Thilini Rent A Car Office',
    defaultDropoffLocation: 'Thilini Rent A Car Office'
  },
  isPlaceholder: true
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const activeRequest = useRef(null);

  const fetchSettings = async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Settings request failed with ${response.status}`);
      const data = await response.json();
      if (data?.settings) {
        setSettings(data.settings);
      }
    } catch {
      // Use fallback defaults
    } finally {
      window.clearTimeout(timeoutId);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSettings();
    return () => activeRequest.current?.abort();
  }, []);

  const updateSettings = async (newData) => {
    // Keep the heavier authenticated API client out of public-page startup.
    const { settingService } = await import('../services/settingService');
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
