import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export const SEOHead = ({ title, description, schemaData }) => {
  const { settings } = useSettings();
  const location = useLocation();

  const siteTitle = settings.businessName || 'Thilini Rent A Car';
  const pageTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - Sri Lanka Car Rental & Airport Transfers`;
  const pageDescription =
    description ||
    settings.supportingText ||
    'Affordable self-drive and chauffeur-driven car rentals across Sri Lanka with 24/7 Katunayake Airport delivery.';

  useEffect(() => {
    document.title = pageTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageDescription;

    // Inject / Update JSON-LD structured data for CarRental & LocalBusiness
    let scriptTag = document.getElementById('trc-jsonld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'trc-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': ['CarRental', 'LocalBusiness'],
      name: siteTitle,
      description: pageDescription,
      url: window.location.origin,
      telephone: settings.phone,
      priceRange: 'LKR 7500 - LKR 40000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Katunayake / Colombo',
        addressCountry: 'LK'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 7.1738,
        longitude: 79.8459
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59'
        }
      ]
    };

    scriptTag.text = JSON.stringify(schemaData || defaultSchema);
  }, [pageTitle, pageDescription, schemaData, siteTitle, settings]);

  return null;
};
