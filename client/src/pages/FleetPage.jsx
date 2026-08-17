import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Car
} from 'lucide-react';
import { VehicleCard } from '../components/common/VehicleCard';
import { VehicleCardSkeleton } from '../components/common/VehicleCardSkeleton';
import { vehicleService, withVehicleCacheVersion } from '../services/vehicleService';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getFleetCacheEntry } from '../services/fleetCache';

const CATEGORIES = [
  'Economy',
  'Compact',
  'Sedan',
  'Hybrid',
  'SUV',
  'Van',
  'Luxury',
  'Wedding Vehicle'
];

const TRANSMISSIONS = ['Automatic', 'Manual'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const SERVICE_TYPES = [
  'Self Drive',
  'With Driver',
  'Airport Transfer',
  'Wedding Hire',
  'Long-Term Rental'
];

export const FleetPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State derived from URL search parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedTransmission, setSelectedTransmission] = useState(searchParams.get('transmission') || '');
  const [selectedFuel, setSelectedFuel] = useState(searchParams.get('fuel') || '');
  const [selectedService, setSelectedService] = useState(searchParams.get('serviceType') || '');
  const [selectedSeats, setSelectedSeats] = useState(searchParams.get('seats') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'price_asc');

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(Math.max(1, Number(searchParams.get('page')) || 1));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const requestSequence = useRef(0);
  const vehiclesRef = useRef(vehicles);
  vehiclesRef.current = vehicles;
  const debouncedSearch = useDebouncedValue(search, 300);
  const debouncedMinPrice = useDebouncedValue(minPrice, 300);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, 300);

  const fleetParams = useMemo(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedTransmission) params.transmission = selectedTransmission;
    if (selectedFuel) params.fuelType = selectedFuel;
    if (selectedService) params.serviceType = selectedService;
    if (selectedSeats) params.seats = selectedSeats;
    if (debouncedMinPrice) params.minPrice = debouncedMinPrice;
    if (debouncedMaxPrice) params.maxPrice = debouncedMaxPrice;
    if (sort) params.sort = sort;
    params.page = page;
    params.limit = 9;
    return params;
  }, [
    debouncedSearch,
    selectedCategory,
    selectedTransmission,
    selectedFuel,
    selectedService,
    selectedSeats,
    debouncedMinPrice,
    debouncedMaxPrice,
    sort,
    page
  ]);
  const cacheableFleetParams = useMemo(() => withVehicleCacheVersion(fleetParams), [fleetParams]);

  // Reuse cached results, retain existing cards, and refresh without blocking the grid.
  useEffect(() => {
    const controller = new AbortController();
    const sequence = ++requestSequence.current;
    const cached = getFleetCacheEntry(cacheableFleetParams);
    const hasUsableData = Boolean(cached) || vehiclesRef.current.length > 0;

    if (cached) {
      setVehicles(cached.data.vehicles || []);
      setTotal(cached.data.total || 0);
      setTotalPages(cached.data.totalPages || 1);
      setLoading(false);
      setError(null);
      if (cached.isFresh && retryNonce === 0) {
        setRefreshing(false);
        return () => controller.abort();
      }
    } else {
      setLoading(!hasUsableData);
      setRefreshing(hasUsableData);
    }

    const fetchFleet = async () => {
      if (hasUsableData) setRefreshing(true);
      setError(null);

      try {
        const data = await vehicleService.getVehicles(cacheableFleetParams, {
          signal: controller.signal,
          force: Boolean(cached && !cached.isFresh) || retryNonce > 0
        });
        if (sequence === requestSequence.current && !controller.signal.aborted) {
          setVehicles(data.vehicles || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          if (retryNonce > 0) setRetryNonce(0);
        }
      } catch (err) {
        if (sequence === requestSequence.current && err.code !== 'ERR_CANCELED') {
          console.error('Error fetching fleet:', err);
          setError(err.userMessage || 'Vehicles are temporarily unavailable. Please try again in a moment.');
        }
      } finally {
        if (sequence === requestSequence.current && !controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    fetchFleet();
    return () => {
      controller.abort();
    };
  }, [cacheableFleetParams, retryNonce]);

  // Update URL parameters
  const updateUrlParams = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val) {
        nextParams.set(key, val);
      } else {
        nextParams.delete(key);
      }
    });
    if (!Object.hasOwn(newParams, 'page')) nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedTransmission('');
    setSelectedFuel('');
    setSelectedService('');
    setSelectedSeats('');
    setMinPrice('');
    setMaxPrice('');
    setSort('price_asc');
    setPage(1);
    setSearchParams({});
    setMobileFilterOpen(false);
  };

  const activeFilterCount = [
    selectedCategory,
    selectedTransmission,
    selectedFuel,
    selectedService,
    selectedSeats,
    minPrice,
    maxPrice
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filter Count & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <span className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
          Vehicle Category
        </label>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('');
              updateUrlParams({ category: '' });
              setPage(1);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              !selectedCategory
                ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                : 'text-charcoal-700 hover:bg-gray-100'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                const next = selectedCategory === cat ? '' : cat;
                setSelectedCategory(next);
                updateUrlParams({ category: next });
                setPage(1);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                  : 'text-charcoal-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission Filter */}
      <div>
        <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
          Transmission
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TRANSMISSIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                const next = selectedTransmission === t ? '' : t;
                setSelectedTransmission(next);
                updateUrlParams({ transmission: next });
                setPage(1);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-center border transition-all ${
                selectedTransmission === t
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-charcoal-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
          Fuel Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FUEL_TYPES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                const next = selectedFuel === f ? '' : f;
                setSelectedFuel(next);
                updateUrlParams({ fuel: next });
                setPage(1);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-center border transition-all ${
                selectedFuel === f
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-charcoal-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Service Type */}
      <div>
        <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
          Service Type
        </label>
        <select
          value={selectedService}
          onChange={(e) => {
            setSelectedService(e.target.value);
            updateUrlParams({ serviceType: e.target.value });
            setPage(1);
          }}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs font-medium text-charcoal-800 focus:ring-2 focus:ring-brand-600"
        >
          <option value="">All Services</option>
          {SERVICE_TYPES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Seats */}
      <div>
        <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
          Passenger Capacity
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {['', '4', '5', '7'].map((seatVal) => (
            <button
              key={seatVal}
              type="button"
              onClick={() => {
                setSelectedSeats(seatVal);
                updateUrlParams({ seats: seatVal });
                setPage(1);
              }}
              className={`py-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                selectedSeats === seatVal
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-charcoal-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {seatVal ? `${seatVal}+` : 'Any'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-2.5">
          Daily Rate Range (LKR)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              updateUrlParams({ minPrice: e.target.value });
              setPage(1);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-medium"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              updateUrlParams({ maxPrice: e.target.value });
              setPage(1);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-medium"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Our Vehicle Fleet
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Choose from our fleet of reliable Sri Lankan rental vehicles with transparent LKR rates.
          </p>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-subtle mb-8 flex flex-col md:flex-row gap-3.5 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by make, model (e.g. Aqua, Wagon R, KDH)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                updateUrlParams({ search: e.target.value });
                setPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-600 focus:border-brand-600 min-h-[44px]"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  updateUrlParams({ search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="w-full md:w-auto flex items-center gap-2.5 justify-between md:justify-end">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-charcoal-800 font-bold text-xs min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 w-auto">
              <span className="hidden sm:inline text-xs text-gray-500 font-medium">Sort:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateUrlParams({ sort: e.target.value });
                }}
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-charcoal-800 focus:ring-2 focus:ring-brand-600 min-h-[44px]"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Newest Year First</option>
                <option value="name_asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-subtle sticky top-28">
              <FilterContent />
            </div>
          </aside>

          {/* Vehicle Grid & Content Area */}
          <div className="md:col-span-3">
            {/* Results Count Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-charcoal-600">
                Showing {vehicles.length} of {total} vehicles
              </span>
              {refreshing && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-600" role="status">
                  <span className="h-3 w-3 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
                  Updating vehicles…
                </span>
              )}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Content States */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            ) : error && vehicles.length === 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <p className="text-sm font-bold text-red-800">{error}</p>
                <button
                  type="button"
                  onClick={() => setRetryNonce((value) => value + 1)}
                  className="mt-3 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold"
                >
                  Try Again
                </button>
              </div>
            ) : vehicles.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-subtle">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-charcoal-900">
                  No vehicles match your selected filters
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 max-w-sm mx-auto">
                  Try adjusting your category, price range, or transmission filters to view available vehicles.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-semibold text-amber-900">{error}</p>
                    <button
                      type="button"
                      onClick={() => setRetryNonce((value) => value + 1)}
                      className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-charcoal-800 border border-amber-200"
                    >
                      Retry
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle, index) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} priority={index < 3} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => {
                        const nextPage = Math.max(1, page - 1);
                        setPage(nextPage);
                        updateUrlParams({ page: nextPage > 1 ? nextPage : '' });
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50 min-h-[44px]"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-charcoal-700 px-3">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => {
                        const nextPage = Math.min(totalPages, page + 1);
                        setPage(nextPage);
                        updateUrlParams({ page: nextPage > 1 ? nextPage : '' });
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50 min-h-[44px]"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <h3 className="font-bold text-base text-charcoal-900">Filter Vehicles</h3>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="p-2 rounded-lg text-charcoal-600 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <FilterContent />
          </div>
          <div className="p-4 border-t border-gray-200 bg-white flex gap-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-bold text-xs text-charcoal-700 min-h-[48px]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm min-h-[48px]"
            >
              View Results ({total})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
