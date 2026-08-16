import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Layers,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ExternalLink
} from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { admin, isAuthenticated, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Fleet Management', path: '/admin/vehicles', icon: Car },
    { name: 'Bookings & Enquiries', path: '/admin/bookings', icon: Calendar },
    { name: 'Content & FAQs', path: '/admin/content', icon: Layers },
    { name: 'Site & Business Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-charcoal-900 text-white p-4 flex items-center justify-between border-b border-charcoal-800 sticky top-0 z-30">
        <Logo variant="white" size="sm" asLink={false} />
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-charcoal-800 text-gray-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-charcoal-900 text-gray-300 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-charcoal-800 hidden md:block">
            <Logo variant="white" size="sm" asLink={false} />
            <div className="mt-2 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              Management Portal
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-charcoal-800'
                    }`
                  }
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Profile & Actions */}
        <div className="p-4 border-t border-charcoal-800 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-charcoal-800 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs">
              <span className="font-bold text-white block">{admin?.name || 'Administrator'}</span>
              <span className="text-[10px] text-gray-400">{admin?.email}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-charcoal-800 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};
