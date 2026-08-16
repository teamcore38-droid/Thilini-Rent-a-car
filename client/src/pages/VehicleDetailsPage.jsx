import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Fuel,
  Gauge,
  Users,
  Wind,
  Luggage,
  Shield,
  MessageCircle,
  Calendar,
  Check,
  ArrowRight,
  Info,
  MapPin,
  ChevronLeft
} from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/common/VehicleCard';
import { useSettings } from '../context/SettingsContext';

export const VehicleDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { formatCurrency, getWhatsAppUrl } = useSettings();

  const [vehicle, setVehicle] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick calculation state
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [serviceType, setServiceType] = useState('Self Drive');
  const [pickupLocation, setPickupLocation] = useState('Bandaranaike International Airport (CMB - Katunayake)');

  useEffect(() => {
    const fetchVehicleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [vehicleRes, similarRes] = await Promise.all([
          vehicleService.getVehicleBySlug(slug),
          vehicleService.getSimilarVehicles(slug).catch(() => ({ vehicles: [] }))
        ]);

        if (vehicleRes?.vehicle) {
          setVehicle(vehicleRes.vehicle);
          setSelectedImageIndex(0);
          if (vehicleRes.vehicle.serviceTypes?.[0]) {
            setServiceType(vehicleRes.vehicle.serviceTypes[0]);
          }
        } else {
          setError('Vehicle not found.');
        }

        setSimilarVehicles(similarRes?.vehicles || []);
      } catch (err) {
        console.error('Error loading vehicle details:', err);
        setError('Vehicle details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
    window.scrollTo(0, 0);
  }, [slug]);

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
          <h2 className="text-lg font-bold text-charcoal-900">Vehicle Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            The vehicle you are looking for may have been updated or is currently unavailable.
          </p>
          <Link
            to="/fleet"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
          >
            Browse All Fleet
          </Link>
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
    if (serviceType) params.set('serviceType', serviceType);
    if (pickupLocation) params.set('pickupLocation', pickupLocation);
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
                src={currentImage}
                alt={vehicle.name}
                className="w-full h-full object-cover"
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
                {images.map((img, idx) => (
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
                    <img src={img.url} alt={img.alt || vehicle.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Key Features List */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-subtle mt-6">
                <h3 className="font-bold text-sm text-charcoal-900 uppercase tracking-wider mb-4">
                  Vehicle Highlights & Inclusions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-700">
                  {vehicle.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Booking Action Box (5 cols) */}
          <div className="lg:col-span-5">
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
                  <MessageCircle className="w-4 h-4 fill-current" />
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
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-subtle mb-12">
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

        {/* Similar Vehicles Carousel / Grid */}
        {similarVehicles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-charcoal-900">
                Similar Vehicles in {vehicle.category}
              </h3>
              <Link to="/fleet" className="text-xs font-bold text-brand-600 hover:underline">
                View All Fleet
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((sim) => (
                <VehicleCard key={sim._id} vehicle={sim} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
