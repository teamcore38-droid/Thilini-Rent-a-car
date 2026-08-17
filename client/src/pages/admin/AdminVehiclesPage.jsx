import React, { useState, useEffect } from 'react';
import {
  Car,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Wrench,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { useSettings } from '../../context/SettingsContext';
import { ImageUploader } from '../../components/common/ImageUploader';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

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
const SERVICE_OPTIONS = [
  'Self Drive',
  'With Driver',
  'Airport Transfer',
  'Wedding Hire',
  'Long-Term Rental'
];

export const AdminVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { formatCurrency } = useSettings();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Compact',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    doors: 4,
    luggage: 2,
    hasAC: true,
    features: '',
    images: [],
    serviceTypes: ['Self Drive'],
    dailyRate: 10000,
    weeklyRate: 65000,
    monthlyRate: 240000,
    deposit: 25000,
    includedMileagePerDay: 100,
    excessMileageRate: 75,
    status: 'available',
    featured: false
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAdminVehicles();
      setVehicles(data?.vehicles || []);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      category: 'Compact',
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5,
      doors: 4,
      luggage: 2,
      hasAC: true,
      features: 'Air Conditioning, Reverse Camera, Bluetooth, Power Steering, ABS',
      images: [],
      serviceTypes: ['Self Drive', 'With Driver'],
      dailyRate: 12000,
      weeklyRate: 78000,
      monthlyRate: 280000,
      deposit: 25000,
      includedMileagePerDay: 100,
      excessMileageRate: 85,
      status: 'available',
      featured: false
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    
    // Extract image URLs array
    const existingImages = (vehicle.images || []).map((img) =>
      typeof img === 'string' ? img : img.url
    ).filter(Boolean);

    setFormData({
      name: vehicle.name,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      category: vehicle.category,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      seats: vehicle.seats,
      doors: vehicle.doors,
      luggage: vehicle.luggage,
      hasAC: vehicle.hasAC,
      features: vehicle.features?.join(', ') || '',
      images: existingImages,
      serviceTypes: vehicle.serviceTypes || ['Self Drive'],
      dailyRate: vehicle.dailyRate,
      weeklyRate: vehicle.weeklyRate || 0,
      monthlyRate: vehicle.monthlyRate || 0,
      deposit: vehicle.deposit || 25000,
      includedMileagePerDay: vehicle.includedMileagePerDay || 100,
      excessMileageRate: vehicle.excessMileageRate || 75,
      status: vehicle.status || 'available',
      featured: !!vehicle.featured
    });
    setError('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formattedImages =
        formData.images.length > 0
          ? formData.images.map((url, index) => ({
              url,
              alt: `${formData.name} Photo ${index + 1}`,
              isPrimary: index === 0
            }))
          : [
              {
                url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                alt: formData.name,
                isPrimary: true
              }
            ];

      const payload = {
        ...formData,
        features: formData.features
          ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
          : [],
        images: formattedImages
      };

      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle._id, payload);
      } else {
        await vehicleService.createVehicle(payload);
      }

      setModalOpen(false);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to archive this vehicle?')) return;
    try {
      await vehicleService.deleteVehicle(id);
      fetchVehicles();
    } catch (err) {
      alert('Failed to delete vehicle.');
    }
  };

  const toggleStatus = async (vehicle, newStatus) => {
    try {
      await vehicleService.updateVehicle(vehicle._id, { status: newStatus });
      fetchVehicles();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Fleet Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Add models, upload photos to Cloudinary, configure rates, deposits, and availability status.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-charcoal-800 text-base">No vehicles found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">Click below to add your first vehicle.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Daily Rate</th>
                  <th className="p-3">Deposit</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getOptimizedImageUrl(v.images?.[0]?.url, { width: 120, height: 90, crop: 'fill' })}
                          alt={v.name}
                          className="w-12 h-9 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          loading="lazy"
                        />
                        <div>
                          <span className="font-bold block text-charcoal-900">{v.name}</span>
                          <span className="text-[11px] text-gray-500">
                            {v.year} • {v.transmission} • {v.fuelType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold">{v.category}</td>
                    <td className="p-3 font-bold text-brand-600">
                      {formatCurrency(v.dailyRate)}/day
                    </td>
                    <td className="p-3 text-gray-600">
                      {formatCurrency(v.deposit || 25000)}
                    </td>
                    <td className="p-3">
                      <select
                        value={v.status}
                        onChange={(e) => toggleStatus(v, e.target.value)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border focus:ring-0 ${
                          v.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : v.status === 'booked'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : v.status === 'maintenance'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {v.featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(v)}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-charcoal-700"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(v._id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="Archive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-charcoal-900">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle to Fleet'}
                </h3>
                <p className="text-xs text-gray-500">Configure vehicle specifications and rates.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-charcoal-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Vehicle Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Toyota Aqua Hybrid 2022"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="Toyota"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Aqua"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Transmission
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  >
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Seats
                  </label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value, 10) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              {/* Rates */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-extrabold text-charcoal-900 uppercase tracking-wider text-[11px]">
                  Pricing & Policy (LKR)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Daily Rate (LKR) *</label>
                    <input
                      type="number"
                      required
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: parseFloat(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-bold text-brand-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Weekly Rate (LKR)</label>
                    <input
                      type="number"
                      value={formData.weeklyRate}
                      onChange={(e) => setFormData({ ...formData, weeklyRate: parseFloat(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Monthly Rate (LKR)</label>
                    <input
                      type="number"
                      value={formData.monthlyRate}
                      onChange={(e) => setFormData({ ...formData, monthlyRate: parseFloat(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Refundable Deposit</label>
                    <input
                      type="number"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Free Km/Day</label>
                    <input
                      type="number"
                      value={formData.includedMileagePerDay}
                      onChange={(e) => setFormData({ ...formData, includedMileagePerDay: parseInt(e.target.value, 10) })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Excess Km (LKR)</label>
                    <input
                      type="number"
                      value={formData.excessMileageRate}
                      onChange={(e) => setFormData({ ...formData, excessMileageRate: parseFloat(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Cloudinary Image Uploader */}
              <div className="pt-2">
                <ImageUploader
                  images={formData.images}
                  onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                  folder="thilini_rent_a_car/vehicles"
                  maxImages={8}
                />
              </div>

              {/* Features */}
              <div>
                <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Air Conditioning, Reverse Camera, Push Start, Bluetooth, ABS"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Create Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
