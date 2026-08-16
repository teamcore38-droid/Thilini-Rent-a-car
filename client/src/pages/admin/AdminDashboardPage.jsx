import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  CheckCircle,
  Clock,
  Wrench,
  Calendar,
  ArrowRight,
  MessageCircle,
  Phone,
  AlertCircle
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useSettings } from '../../context/SettingsContext';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    pendingRequests: 0,
    confirmedBookings: 0,
    maintenanceVehicles: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency, getWhatsAppUrl } = useSettings();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await bookingService.getAdminStats();
        if (data?.stats) {
          setStats(data.stats);
        }
        if (data?.recentBookings) {
          setRecentBookings(data.recentBookings);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Pending Requests',
      count: stats.pendingRequests,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      title: 'Confirmed Bookings',
      count: stats.confirmedBookings,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      title: 'Total Active Fleet',
      count: stats.totalVehicles,
      icon: Car,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      title: 'Available Vehicles',
      count: stats.availableVehicles,
      icon: Car,
      color: 'bg-green-50 text-green-700 border-green-200',
      badgeColor: 'bg-green-600 text-white'
    },
    {
      title: 'In Maintenance',
      count: stats.maintenanceVehicles,
      icon: Wrench,
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      badgeColor: 'bg-gray-600 text-white'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Admin Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time fleet status and reservation requests for Thilini Rent A Car.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage All Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border ${card.color} shadow-subtle flex flex-col justify-between bg-white`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-charcoal-900">
                {card.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Recent Enquiries / Bookings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-charcoal-900">
              Recent Booking Enquiries
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest incoming reservation requests from website visitors.
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl" />
            ))}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
            <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-charcoal-800 text-sm">No bookings recorded yet</h3>
            <p className="text-xs text-gray-500 mt-1">
              New customer booking requests will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-600">
                      {b.referenceNumber}
                    </td>
                    <td className="p-3">
                      <span className="font-bold block text-charcoal-900">{b.customerName}</span>
                      <span className="text-[11px] text-gray-500">{b.phone}</span>
                    </td>
                    <td className="p-3 font-medium">
                      {b.vehicle?.name || 'Unassigned Vehicle'}
                    </td>
                    <td className="p-3 text-[11px]">
                      <div>{new Date(b.pickupDateTime).toLocaleDateString()}</div>
                      <div className="text-gray-400">to {new Date(b.returnDateTime).toLocaleDateString()}</div>
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
                              `Hello ${b.customerName}, this is Thilini Rent A Car regarding your booking request ${b.referenceNumber}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          to={`/admin/bookings?id=${b._id}`}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-charcoal-800 font-bold text-[11px]"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
