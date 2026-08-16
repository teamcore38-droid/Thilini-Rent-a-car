import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Plane,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { useSettings } from '../context/SettingsContext';

const SRI_LANKA_LOCATIONS = [
  'Bandaranaike International Airport (CMB - Katunayake)',
  'Colombo City (Fort / Kollupitiya / Bambalapitiya)',
  'Negombo Beach / City',
  'Kandy City Center',
  'Galle Fort / City',
  'Bentota / Beruwala',
  'Mirissa / Weligama',
  'Ella / Badulla',
  'Nuwara Eliya Town',
  'Sigiriya / Dambulla',
  'Trincomalee / Nilaveli',
  'Jaffna Town',
  'Custom Location / Hotel Delivery'
];

const SERVICE_TYPES = [
  'Self Drive',
  'With Driver',
  'Airport Transfer',
  'Wedding Hire',
  'Long-Term Rental'
];

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatCurrency, getWhatsAppUrl } = useSettings();

  const [currentStep, setCurrentStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Success Confirmation State
  const [bookingResult, setBookingResult] = useState(null);

  // Step 1: Rental details
  const [selectedVehicleId, setSelectedVehicleId] = useState(searchParams.get('vehicle') || '');
  const [serviceType, setServiceType] = useState(searchParams.get('serviceType') || 'Self Drive');
  const [pickupLocation, setPickupLocation] = useState(
    searchParams.get('pickupLocation') || SRI_LANKA_LOCATIONS[0]
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    searchParams.get('dropoffLocation') || SRI_LANKA_LOCATIONS[0]
  );
  const [pickupDateTime, setPickupDateTime] = useState(
    searchParams.get('pickupDate') ? `${searchParams.get('pickupDate')}T10:00` : ''
  );
  const [returnDateTime, setReturnDateTime] = useState(
    searchParams.get('returnDate') ? `${searchParams.get('returnDate')}T10:00` : ''
  );

  // Step 2: Customer details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  const [passengerCount, setPassengerCount] = useState(1);
  const [flightNumber, setFlightNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('WhatsApp');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Fetch active vehicles on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles({ limit: 50 });
        setVehicles(data.vehicles || []);
        if (!selectedVehicleId && data.vehicles?.length > 0) {
          setSelectedVehicleId(data.vehicles[0]._id);
        }
      } catch (err) {
        console.error('Failed to load fleet:', err);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, [selectedVehicleId]);

  const selectedVehicle = vehicles.find((v) => v._id === selectedVehicleId);

  // Calculation helpers
  const calculateDays = () => {
    if (!pickupDateTime || !returnDateTime) return 1;
    const start = new Date(pickupDateTime);
    const end = new Date(returnDateTime);
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    const diff = Math.abs(end - start);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const rentalDays = calculateDays();
  const estimatedCost = selectedVehicle ? rentalDays * selectedVehicle.dailyRate : 0;

  // Step 1 Validation
  const validateStep1 = () => {
    if (!selectedVehicleId) {
      setError('Please select a vehicle.');
      return false;
    }
    if (!pickupDateTime || !returnDateTime) {
      setError('Please choose both pickup and return date/time.');
      return false;
    }
    if (new Date(returnDateTime) <= new Date(pickupDateTime)) {
      setError('Return date and time must be strictly after pickup date and time.');
      return false;
    }
    setError('');
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!customerName.trim()) {
      setError('Full name is required.');
      return false;
    }
    if (!phone.trim() || phone.length < 7) {
      setError('A valid Sri Lankan (+94) or International phone number is required.');
      return false;
    }
    if (!agreeTerms) {
      setError('You must agree to the rental terms and conditions.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        vehicle: selectedVehicleId,
        serviceType,
        pickupLocation,
        dropoffLocation,
        pickupDateTime: new Date(pickupDateTime).toISOString(),
        returnDateTime: new Date(returnDateTime).toISOString(),
        customerName,
        phone,
        email,
        country,
        passengerCount: parseInt(passengerCount, 10) || 1,
        flightNumber,
        notes,
        preferredContactMethod
      };

      const response = await bookingService.createBooking(payload);
      if (response?.success) {
        setBookingResult(response);
      } else {
        setError(response?.message || 'Failed to submit booking request.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'A booking conflict occurred or server is unreachable. Please try again or message us on WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyReference = () => {
    if (bookingResult?.booking?.referenceNumber) {
      navigator.clipboard.writeText(bookingResult.booking.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (bookingResult) {
    const { booking, whatsappUrl } = bookingResult;
    return (
      <div className="min-h-screen bg-gray-50/70 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl text-center">
          {/* Success Check Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Booking Request Received (Pending Confirmation)
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-4 mb-2">
            Thank You, {booking.customerName}!
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            Your booking request has been registered with status <strong className="text-amber-600">Pending</strong>. Our team will verify vehicle schedule and contact you shortly.
          </p>

          {/* Reference Card */}
          <div className="my-6 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
              <span className="text-xs text-gray-500 font-semibold">Booking Reference:</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-brand-600 font-mono tracking-wider">
                  {booking.referenceNumber}
                </span>
                <button
                  type="button"
                  onClick={copyReference}
                  className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-charcoal-700">
              <div>
                <span className="text-gray-500 block">Service Type:</span>
                <span className="font-bold">{booking.serviceType}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Rental Duration:</span>
                <span className="font-bold">{booking.rentalDays} Day(s)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Estimated Rate:</span>
                <span className="font-bold text-brand-600">
                  {booking.isEstimatedPriceAccurate
                    ? formatCurrency(booking.estimatedPrice)
                    : 'To be confirmed'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Pickup Location:</span>
                <span className="font-bold truncate block">{booking.pickupLocation}</span>
              </div>
            </div>
          </div>

          {/* Instant WhatsApp Action */}
          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-all min-h-[48px]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Confirm Instant Availability on WhatsApp</span>
            </a>

            <Link
              to="/fleet"
              className="w-full inline-flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-gray-200 text-charcoal-800 rounded-xl font-bold text-xs transition-colors min-h-[44px]"
            >
              Back to Fleet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-md">
            Reservation Request
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 mt-2">
            Book Your Vehicle
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Fast, secure 3-step booking with zero mandatory upfront fee.
          </p>
        </div>

        {/* Multi-Step Indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((step) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                      : 'bg-gray-200 text-charcoal-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step}
                </div>
                <span className="text-[10px] font-bold text-charcoal-700 mt-1">
                  {step === 1 ? 'Rental' : step === 2 ? 'Details' : 'Review'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-red-700">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-card">
          {/* STEP 1: RENTAL DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-charcoal-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-600" />
                <span>Step 1 – Rental Details</span>
              </h2>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2">
                  Select Vehicle
                </label>
                {loadingVehicles ? (
                  <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-semibold text-charcoal-900 focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                  >
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.category} - {v.transmission}) • {formatCurrency(v.dailyRate)}/day
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2">
                  Service Option
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICE_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setServiceType(type)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center min-h-[44px] ${
                        serviceType === type
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-gray-50 text-charcoal-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>Pickup Location</span>
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-charcoal-800 focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                  >
                    {SRI_LANKA_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>Drop-off Location</span>
                  </label>
                  <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-charcoal-800 focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                  >
                    {SRI_LANKA_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>Pickup Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupDateTime}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setPickupDateTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-charcoal-800 focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>Return Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={returnDateTime}
                    min={pickupDateTime || new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setReturnDateTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-charcoal-800 focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CUSTOMER DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-charcoal-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                <span>Step 2 – Customer Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priyantha Silva or John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                    Contact Phone Number (WhatsApp Enabled) *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +94 77 123 4567 or +44 7911 123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Sri Lanka, UK, Australia, Germany"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Conditional Flight Number for Airport Transfers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                    Number of Passengers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5 text-brand-600" />
                    <span>Flight Number (For Airport Transfer)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UL 504, EK 651, QR 662"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-brand-600 min-h-[48px]"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2">
                  Preferred Confirmation Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['WhatsApp', 'Phone', 'Email'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPreferredContactMethod(method)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all text-center min-h-[44px] ${
                        preferredContactMethod === method
                          ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                          : 'bg-gray-50 text-charcoal-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1.5">
                  Additional Notes or Special Requests
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Need child booster seat, late night pickup, hotel room delivery, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-600"
                />
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-600"
                  />
                  <span className="text-xs text-charcoal-700 leading-relaxed">
                    I agree to the <Link to="/terms" target="_blank" className="text-brand-600 font-bold underline">Rental Terms & Conditions</Link>, including the standard refundable deposit and valid driving licence requirements.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SUBMIT */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-charcoal-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span>Step 3 – Review & Submit Booking Request</span>
              </h2>

              {/* Summary Card */}
              <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div>
                    <h3 className="font-extrabold text-base text-charcoal-900">
                      {selectedVehicle?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedVehicle?.category} • {serviceType}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-brand-100 text-brand-700">
                    {rentalDays} Day(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-700">
                  <div>
                    <span className="text-gray-500 block">Pickup:</span>
                    <span className="font-bold">{pickupLocation}</span>
                    <span className="text-[11px] text-gray-500 block">
                      {new Date(pickupDateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Drop-off:</span>
                    <span className="font-bold">{dropoffLocation}</span>
                    <span className="text-[11px] text-gray-500 block">
                      {new Date(returnDateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Customer Name:</span>
                    <span className="font-bold">{customerName}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Phone & WhatsApp:</span>
                    <span className="font-bold">{phone}</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="pt-3 border-t border-gray-200 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-charcoal-800">
                    Estimated Rental Total:
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-black text-brand-600">
                      {formatCurrency(estimatedCost)}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      *Deposit & fuel settled at vehicle handover
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Submission creates a <em>Pending</em> request. Availability is confirmed when our representative contacts you directly.
                </span>
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-charcoal-700 hover:bg-gray-50 min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-6 py-3 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all min-h-[44px]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitBooking}
                className="flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-black text-sm shadow-lg hover:shadow-brand-600/30 transition-all disabled:opacity-50 min-h-[48px]"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm & Send Booking Request</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
