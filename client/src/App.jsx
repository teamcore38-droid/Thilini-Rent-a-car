import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PublicLayout } from './components/layout/PublicLayout';
import { prefetchFleetPage, prefetchVehicleDetailsPage } from './utils/routePrefetch';

const lazyNamed = (loader, exportName) =>
  lazy(() => loader().then((module) => ({ default: module[exportName] })));

// Route-level chunks keep pages that are not being viewed out of the initial download.
const HomePage = lazyNamed(() => import('./pages/HomePage'), 'HomePage');
const FleetPage = lazyNamed(prefetchFleetPage, 'FleetPage');
const VehicleDetailsPage = lazyNamed(
  prefetchVehicleDetailsPage,
  'VehicleDetailsPage'
);
const ServicesPage = lazyNamed(() => import('./pages/ServicesPage'), 'ServicesPage');
const AboutPage = lazyNamed(() => import('./pages/AboutPage'), 'AboutPage');
const BookingPage = lazyNamed(() => import('./pages/BookingPage'), 'BookingPage');
const FaqPage = lazyNamed(() => import('./pages/FaqPage'), 'FaqPage');
const ContactPage = lazyNamed(() => import('./pages/ContactPage'), 'ContactPage');
const TermsPage = lazyNamed(() => import('./pages/TermsPage'), 'TermsPage');
const PrivacyPage = lazyNamed(() => import('./pages/PrivacyPage'), 'PrivacyPage');
const NotFoundPage = lazyNamed(() => import('./pages/NotFoundPage'), 'NotFoundPage');

const AdminAuthBoundary = lazyNamed(
  () => import('./components/layout/AdminAuthBoundary'),
  'AdminAuthBoundary'
);
const AdminLoginPage = lazyNamed(
  () => import('./pages/admin/AdminLoginPage'),
  'AdminLoginPage'
);
const AdminLayout = lazyNamed(() => import('./pages/admin/AdminLayout'), 'AdminLayout');
const AdminDashboardPage = lazyNamed(
  () => import('./pages/admin/AdminDashboardPage'),
  'AdminDashboardPage'
);
const AdminVehiclesPage = lazyNamed(
  () => import('./pages/admin/AdminVehiclesPage'),
  'AdminVehiclesPage'
);
const AdminBookingsPage = lazyNamed(
  () => import('./pages/admin/AdminBookingsPage'),
  'AdminBookingsPage'
);
const AdminContentPage = lazyNamed(
  () => import('./pages/admin/AdminContentPage'),
  'AdminContentPage'
);
const AdminSettingsPage = lazyNamed(
  () => import('./pages/admin/AdminSettingsPage'),
  'AdminSettingsPage'
);

const PageLoader = () => (
  <div className="min-h-[40vh] flex items-center justify-center" role="status" aria-label="Loading page">
    <div className="w-9 h-9 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Layout Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="fleet" element={<FleetPage />} />
              <Route path="fleet/:slug" element={<VehicleDetailsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="book" element={<BookingPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin code and authentication only load for admin routes. */}
            <Route element={<AdminAuthBoundary />}>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="vehicles" element={<AdminVehiclesPage />} />
                <Route path="bookings" element={<AdminBookingsPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
