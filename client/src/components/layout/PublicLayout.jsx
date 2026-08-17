import React, { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { MobileBottomBar } from './MobileBottomBar';

const Footer = lazy(() => import('./Footer').then((module) => ({ default: module.Footer })));

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen has-mobile-bottom-bar">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <FloatingWhatsApp />
      <MobileBottomBar />
    </div>
  );
};
