import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Download,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  FileText,
  AlertCircle,
  User,
  MapPin,
  Plane,
  X,
  Check
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { vehicleService } from '../../services/vehicleService';
import { useSettings } from '../../context/SettingsContext';

const STATUS_OPTIONS = ['all', 'Pending', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Edit fields in modal
  const [status, setStatus] = useState('Pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [assignedVehicleId, setAssignedVehicleId] = useState('');

  const { formatCurrency } = useSettings();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;
      params.limit = 50;

      const data = await bookingService.getAdminBookings(params);
      setBookings(data?.bookings || []);
      setTotal(data?.total || 0);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    const fetchVehiclesList = async () => {
      try {
        const data = await vehicleService.getAdminVehicles();
        setVehicles(data?.vehicles || []);
      } catch (err) {
        console.error('Failed to load vehicles list:', err);
      }
    };
    fetchVehiclesList();
  }, []);

  const openBookingModal = (booking) => {
    setSelectedBooking(booking);
    setStatus(booking.status);
    setAdminNotes(booking.adminNotes || '');
    setAssignedVehicleId(booking.vehicle?._id || '');
    setUpdateError('');
    setModalOpen(true);
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');

    try {
      await bookingService.updateAdminBooking(selectedBooking._id, {
        status,
        adminNotes,
        vehicle: assignedVehicleId
      });
      setModalOpen(false);
      fetchBookings();
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || 'Failed to update booking. Possible date overlap conflict.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await bookingService.exportBookingsCSV();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `thilini-car-rental-bookings-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('Failed to export CSV.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Booking & Reservation Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review customer requests, confirm availability, manage statuses, and export reports.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-subtle flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 text-charcoal-700 hover:bg-gray-200'
              }`}
            >
              {st === 'all' ? 'All Bookings' : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-brand-600 min-h-[40px]"
          />
        </div>
      </div>

      {/* Bookings Table / Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-charcoal-800 text-base">No bookings found</h3>
            <p className="text-xs text-gray-500 mt-1">Try switching status filters or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vehicle / Service</th>
                  <th className="p-3">Rental Dates</th>
                  <th className="p-3">Locations</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3">
                      <span className="font-mono font-black text-brand-600 block">
                        {b.referenceNumber}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-charcoal-900 block">{b.customerName}</span>
                      <span className="text-gray-500 text-[11px] block">{b.phone}</span>
                      {b.email && <span className="text-gray-400 text-[10px] block">{b.email}</span>}
                    </td>
                    <td className="p-3">
                      <span className="font-bold block text-charcoal-800">
                        {b.vehicle?.name || 'Assigned Vehicle'}
                      </span>
                      <span className="text-[11px] text-brand-700 font-medium">
                        {b.serviceType}
                      </span>
                    </td>
                    <td className="p-3 text-[11px]">
                      <div>
                        <strong>Pickup:</strong> {new Date(b.pickupDateTime).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                      <div className="text-gray-500">
                        <strong>Return:</strong> {new Date(b.returnDateTime).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="p-3 text-[11px] max-w-xs truncate">
                      <div>
                        <span className="text-gray-400">From:</span> {b.pickupLocation}
                      </div>
                      <div>
                        <span className="text-gray-400">To:</span> {b.dropoffLocation}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {b.phone && (
                          <a
                            href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${b.customerName}, this is Thilini Rent A Car regarding your reservation *${b.referenceNumber}* (${b.vehicle?.name || ''}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => openBookingModal(b)}
                          className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-[11px]"
                        >
                          Manage
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

      {/* Booking Details & Status Modal */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Booking Reference</span>
                <h2 className="text-xl font-mono font-black text-brand-600">
                  {selectedBooking.referenceNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateError && (
              <div className="my-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{updateError}</span>
              </div>
            )}

            {/* Customer & Booking Details Matrix */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs text-charcoal-700 border-b border-gray-100">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Customer</span>
                <span className="font-bold text-sm text-charcoal-900">{selectedBooking.customerName}</span>
                <span className="block text-gray-600">{selectedBooking.phone}</span>
                <span className="block text-gray-500">{selectedBooking.email || 'No email provided'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Service & Flight</span>
                <span className="font-bold">{selectedBooking.serviceType}</span>
                {selectedBooking.flightNumber && (
                  <span className="block text-brand-600 font-bold">Flight: {selectedBooking.flightNumber}</span>
                )}
                <span className="block text-gray-500">Contact: {selectedBooking.preferredContactMethod}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Pickup Time & Place</span>
                <span className="font-semibold block">{selectedBooking.pickupLocation}</span>
                <span className="text-gray-500">{new Date(selectedBooking.pickupDateTime).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Return Time & Place</span>
                <span className="font-semibold block">{selectedBooking.dropoffLocation}</span>
                <span className="text-gray-500">{new Date(selectedBooking.returnDateTime).toLocaleString()}</span>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="py-3 bg-gray-50 p-3 rounded-xl text-xs text-charcoal-700 my-3">
                <span className="font-bold text-gray-500 block text-[10px] uppercase">Customer Notes:</span>
                <p className="mt-0.5 italic">"{selectedBooking.notes}"</p>
              </div>
            )}

            {/* Status Update Form */}
            <form onSubmit={handleUpdateBooking} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Booking Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed (Locks Date Schedule)</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    Assign / Change Vehicle
                  </label>
                  <select
                    value={assignedVehicleId}
                    onChange={(e) => setAssignedVehicleId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                  >
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Internal Staff Notes (Not visible to customer)
                </label>
                <textarea
                  rows="3"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Deposit paid via bank transfer, driver Sunil assigned, airport meetup arranged."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <a
                  href={`https://wa.me/${selectedBooking.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedBooking.customerName}, this is Thilini Rent A Car confirming your booking ${selectedBooking.referenceNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Open Customer WhatsApp</span>
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                  >
                    {updating ? 'Saving...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
