import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Fuel,
  Gauge,
  Users,
  Calendar,
  Check,
  Info
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/common/VehicleCard';
import { VehicleCardSkeleton } from '../components/common/VehicleCardSkeleton';
import { useSettings } from '../context/SettingsContext';
import {
  getOptimizedImageUrl,
  getResponsiveImageSrcSet,
  ImagePresets
} from '../utils/imageOptimizer';

const VehicleHighlights = ({ features, className = '', layoutSection }) => {
  if (!features?.length) return null;

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-subtle ${className}`}
      data-layout-section={layoutSection}
    >
      <h3 className="font-bold text-sm text-charcoal-900 uppercase tracking-wider mb-4">
        Vehicle Highlights &amp; Inclusions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-700">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const VehicleDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { formatCurrency, getWhatsAppUrl } = useSettings();

  const [vehicle, setVehicle] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState(null);
  const [primaryRetry, setPrimaryRetry] = useState(0);
  const [similarRetry, setSimilarRetry] = useState(0);
  const primaryRequestSequence = useRef(0);
  const similarRequestSequence = useRef(0);

  // Quick calculation state
  const pickupDate = '';
  const returnDate = '';
  const [serviceType, setServiceType] = useState('Self Drive');
  const pickupLocation = 'Bandaranaike International Airport (CMB - Katunayake)';

  useEffect(() => {
    const controller = new AbortController();
    const requestSequence = ++primaryRequestSequence.current;

    const fetchVehicleData = async () => {
      setLoading(true);
      setError(null);
      setVehicle(null);
      setSimilarVehicles([]);
      setSimilarError(null);
      try {
        const vehicleRes = await vehicleService.getVehicleBySlug(slug, {
          signal: controller.signal
        });

        if (requestSequence !== primaryRequestSequence.current || controller.signal.aborted) return;

        if (vehicleRes?.vehicle?.slug === slug) {
          setVehicle(vehicleRes.vehicle);
          setSelectedImageIndex(0);
          if (vehicleRes.vehicle.serviceTypes?.[0]) {
            setServiceType(vehicleRes.vehicle.serviceTypes[0]);
          }
        } else {
          setError('Vehicle not found.');
        }
      } catch (err) {
        if (err.code !== 'ERR_CANCELED' && requestSequence === primaryRequestSequence.current) {
          console.error('Error loading vehicle details:', err);
          setError(err.userMessage || 'Vehicle details could not be loaded. Please try again.');
        }
      } finally {
        if (requestSequence === primaryRequestSequence.current && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchVehicleData();
    window.scrollTo(0, 0);
    return () => controller.abort();
  }, [slug, primaryRetry]);

  useEffect(() => {
    if (!vehicle?.category || vehicle.slug !== slug) return undefined;

    const controller = new AbortController();
    const requestSequence = ++similarRequestSequence.current;

    const fetchSimilarVehicles = async () => {
      setSimilarLoading(true);
      setSimilarError(null);
      try {
        const response = await vehicleService.getSimilarVehicles(vehicle.category, slug, {
          signal: controller.signal
        });
        if (requestSequence === similarRequestSequence.current && !controller.signal.aborted) {
          setSimilarVehicles(response?.vehicles || []);
        }
      } catch (err) {
        if (err.code !== 'ERR_CANCELED' && requestSequence === similarRequestSequence.current) {
          setSimilarError('Similar vehicles could not be loaded right now.');
        }
      } finally {
        if (requestSequence === similarRequestSequence.current && !controller.signal.aborted) {
          setSimilarLoading(false);
        }
      }
    };

    fetchSimilarVehicles();
    return () => controller.abort();
  }, [vehicle?.category, vehicle?.slug, slug, similarRetry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-charcoal-700">Loading vehicle specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-subtle">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-charcoal-900">Vehicle details unavailable</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            {error || 'The vehicle you are looking for may have been updated or is currently unavailable.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              type="button"
              onClick={() => setPrimaryRetry((value) => value + 1)}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
            >
              Try Again
            </button>
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-100 text-charcoal-800 rounded-xl text-xs font-bold hover:bg-gray-200"
            >
              Browse All Fleet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = vehicle.images?.length > 0
    ? vehicle.images
    : [{ url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', alt: vehicle.name }];

  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;

  // Build WhatsApp enquiry message with vehicle details
  const preFilledWhatsAppMessage =
    `Hello Thilini Rent A Car! I would like to inquire about renting the *${vehicle.name}* (${vehicle.year || ''}).\n\n` +
    `🛠 *Service:* ${serviceType}\n` +
    (pickupDate ? `📅 *Pickup Date:* ${pickupDate}\n` : '') +
    (returnDate ? `📅 *Return Date:* ${returnDate}\n` : '') +
    (pickupLocation ? `📍 *Pickup Location:* ${pickupLocation}\n` : '') +
    `💰 *Rate:* ${formatCurrency(vehicle.dailyRate)}/day\n\n` +
    `Please let me know if this vehicle is available. Thank you!`;

  const handleBookNow = () => {
    const params = new URLSearchParams();
    params.set('vehicle', vehicle._id);
    params.set('serviceType', 'Self Drive');
    if (pickupDate) params.set('pickupDate', pickupDate);
    if (returnDate) params.set('returnDate', returnDate);
    navigate(`/book?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link to="/fleet" className="hover:text-brand-600">Fleet</Link>
          <span>/</span>
          <span className="text-charcoal-800 font-bold">{vehicle.name}</span>
        </div>

        {/* Top Grid: Gallery & Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-[16/10] bg-charcoal-900 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src={getOptimizedImageUrl(currentImage, ImagePresets.heroGallery)}
                srcSet={getResponsiveImageSrcSet(
                  currentImage,
                  ImagePresets.heroGallery,
                  [480, 768, 960, 1200]
                )}
                sizes="(max-width: 1023px) 100vw, 58vw"
                alt={vehicle.name}
                className="w-full h-full object-cover"
                width="1200"
                height="800"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 text-charcoal-900 font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-sm backdrop-blur-sm">
                {vehicle.category}
              </span>
              <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm">
                {vehicle.status === 'available' ? 'Available' : 'Advance Booking'}
              </span>
            </div>

            {/* Thumbnail Carousel / List */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => {
                  const imgUrl = typeof img === 'string' ? img : img.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-brand-600 ring-2 ring-brand-600/30'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getOptimizedImageUrl(imgUrl, ImagePresets.thumbnail)}
                        alt={img.alt || `${vehicle.name} Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Desktop highlights remain below the gallery. */}
            <VehicleHighlights
              features={vehicle.features}
              className="hidden lg:block mt-6"
              layoutSection="desktop-highlights"
            />
          </div>

          {/* Pricing & Booking Action Box (5 cols) */}
          <div className="lg:col-span-5" data-layout-section="summary">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-card sticky top-24 space-y-6">
              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900">
                  {vehicle.name}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  {vehicle.make} • {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
                </p>
              </div>

              {/* Rate Card */}
              <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-semibold block">Daily Rental Rate</span>
                    <span className="text-3xl font-black text-brand-600">
                      {formatCurrency(vehicle.dailyRate)}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/ day</span>
                  </div>
                  {vehicle.weeklyRate > 0 && (
                    <div className="text-right">
                      <span className="text-[11px] text-gray-500 block">Weekly Rate</span>
                      <span className="text-sm font-bold text-charcoal-800">
                        {formatCurrency(vehicle.weeklyRate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specs Pill Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Gauge className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <span className="font-bold text-charcoal-800 block truncate">{vehicle.transmission}</span>
                  <span className="text-[10px] text-gray-500">Gearbox</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Fuel className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <span className="font-bold text-charcoal-800 block truncate">{vehicle.fuelType}</span>
                  <span className="text-[10px] text-gray-500">Fuel</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Users className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <span className="font-bold text-charcoal-800 block">{vehicle.seats}</span>
                  <span className="text-[10px] text-gray-500">Passengers</span>
                </div>
              </div>

              {/* Rate & Policy Transparency Table */}
              <div className="space-y-2.5 text-xs text-charcoal-700 pt-2 border-t border-gray-100">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Refundable Deposit</span>
                  <span className="font-bold text-charcoal-900">{formatCurrency(vehicle.deposit || 25000)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Included Mileage</span>
                  <span className="font-bold text-charcoal-900">{vehicle.includedMileagePerDay || 100} km / day</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Excess Mileage Charge</span>
                  <span className="font-bold text-charcoal-900">{formatCurrency(vehicle.excessMileageRate || 75)} / km</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Fuel Policy</span>
                  <span className="font-bold text-charcoal-900">Same-to-Same</span>
                </div>
              </div>

              {/* Conversion Actions */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all min-h-[48px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve This Vehicle</span>
                </button>

                <a
                  href={getWhatsAppUrl(preFilledWhatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-sm transition-all min-h-[48px]"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Instant Quote</span>
                </a>
              </div>

              {/* Safe Note */}
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500">
                <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>No advance payment needed to submit an enquiry. Our team confirms availability and terms before finalizing.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Specifications Matrix */}
        <div
          className={`bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-subtle ${
            vehicle.features?.length ? 'mb-6 lg:mb-12' : 'mb-12'
          }`}
          data-layout-section="technical-specifications"
        >
          <h2 className="text-xl font-extrabold text-charcoal-900 mb-6">
            Detailed Technical Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Make</span>
                <span className="font-bold text-charcoal-900">{vehicle.make}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Model</span>
                <span className="font-bold text-charcoal-900">{vehicle.model}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Manufacturing Year</span>
                <span className="font-bold text-charcoal-900">{vehicle.year}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Category</span>
                <span className="font-bold text-charcoal-900">{vehicle.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Doors</span>
                <span className="font-bold text-charcoal-900">{vehicle.doors || 4} Doors</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Luggage Bags</span>
                <span className="font-bold text-charcoal-900">{vehicle.luggage || 2} Large Bags</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Air Conditioning</span>
                <span className="font-bold text-charcoal-900">{vehicle.hasAC ? 'Dual / Standard A/C' : 'None'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Eligible Services</span>
                <span className="font-bold text-charcoal-900">
                  {vehicle.serviceTypes?.join(', ') || 'Self Drive, Chauffeur'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Roadside Assistance</span>
                <span className="font-bold text-emerald-600">Available Islandwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile highlights follow the summary and detailed specifications. */}
        <VehicleHighlights
          features={vehicle.features}
          className="lg:hidden mb-12"
          layoutSection="mobile-highlights"
        />

        {/* Similar vehicles load independently from the primary vehicle. */}
        <div className="mb-12" data-loading-state={similarLoading ? 'loading' : 'complete'}>
          {(similarLoading || similarError || similarVehicles.length > 0) && (
            <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-charcoal-900">
                Similar Vehicles in {vehicle.category}
              </h3>
              <Link to="/fleet" className="text-xs font-bold text-brand-600 hover:underline">
                View All Fleet
              </Link>
            </div>
            {similarLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => <VehicleCardSkeleton key={index} />)}
              </div>
            ) : similarError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                <p className="text-xs font-semibold text-amber-900">{similarError}</p>
                <button
                  type="button"
                  onClick={() => setSimilarRetry((value) => value + 1)}
                  className="mt-3 rounded-lg bg-white px-4 py-2 text-xs font-bold text-charcoal-800 border border-amber-200"
                >
                  Retry Similar Vehicles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarVehicles.map((sim) => (
                  <VehicleCard key={sim._id} vehicle={sim} />
                ))}
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
