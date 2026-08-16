import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { MobileBottomBar } from './MobileBottomBar';

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen has-mobile-bottom-bar">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomBar />
    </div>
  );
};
