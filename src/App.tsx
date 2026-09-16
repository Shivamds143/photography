import React, { useState, useEffect } from 'react';
import { PageView, Category, PhotographyService, GalleryImage, UserProfile, Booking } from './types';
import { db } from './lib/databaseService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { ProjectGuideModal } from './components/ProjectGuideModal';
import { DatabaseSettingsModal } from './components/DatabaseSettingsModal';

import { HomeView } from './views/HomeView';
import { GalleryView } from './views/GalleryView';
import { ServicesView } from './views/ServicesView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { BookingView } from './views/BookingView';
import { AuthView } from './views/AuthView';
import { CustomerDashboardView } from './views/CustomerDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<PhotographyService[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | null>(null);

  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isDbSettingsOpen, setIsDbSettingsOpen] = useState<boolean>(false);

  // Load app data
  const loadAppData = async () => {
    try {
      const [cats, srvs, imgs, user] = await Promise.all([
        db.getCategories(),
        db.getServices(),
        db.getGalleryImages(),
        db.getCurrentUser()
      ]);
      setCategories(cats);
      setServices(srvs);
      setGalleryImages(imgs);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error loading initial app data:', err);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  // Smooth scroll to top when page changes
  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (slug: string) => {
    setSelectedCategorySlug(slug);
    navigateTo('gallery');
  };

  const handleSelectServiceForBooking = (serviceId: string) => {
    setPreSelectedServiceId(serviceId);
    navigateTo('booking');
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      navigateTo('admin-dashboard');
    } else {
      navigateTo('customer-dashboard');
    }
  };

  const handleLogout = async () => {
    await db.logout();
    setCurrentUser(null);
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] font-sans text-slate-100 selection:bg-[#d4af37] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDbModal={() => setIsDbSettingsOpen(true)}
      />

      {/* Main Content Router */}
      <main className="min-h-[calc(100vh-80px)]">
        {currentPage === 'home' && (
          <HomeView
            categories={categories}
            services={services}
            galleryImages={galleryImages}
            setCurrentPage={navigateTo}
            onSelectCategory={handleSelectCategoryFromHome}
            onSelectServiceForBooking={handleSelectServiceForBooking}
            onOpenLightbox={(img) => setLightboxImage(img)}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryView
            categories={categories}
            galleryImages={galleryImages}
            selectedCategorySlug={selectedCategorySlug}
            onSelectCategorySlug={setSelectedCategorySlug}
            onOpenLightbox={(img) => setLightboxImage(img)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesView
            services={services}
            setCurrentPage={navigateTo}
            onSelectServiceForBooking={handleSelectServiceForBooking}
          />
        )}

        {currentPage === 'about' && (
          <AboutView setCurrentPage={navigateTo} />
        )}

        {currentPage === 'contact' && (
          <ContactView
            categories={categories}
            setCurrentPage={navigateTo}
          />
        )}

        {currentPage === 'booking' && (
          <BookingView
            services={services}
            preSelectedServiceId={preSelectedServiceId}
            currentUser={currentUser}
            setCurrentPage={navigateTo}
            onBookingCreated={() => {
              loadAppData();
            }}
          />
        )}

        {(currentPage === 'login' || currentPage === 'register' || currentPage === 'admin-login') && (
          <AuthView
            initialMode={currentPage}
            onAuthSuccess={handleAuthSuccess}
            setCurrentPage={navigateTo}
          />
        )}

        {(currentPage === 'customer-dashboard' || currentPage === 'customer-bookings' || currentPage === 'customer-profile') && (
          currentUser ? (
            <CustomerDashboardView
              currentUser={currentUser}
              setCurrentPage={navigateTo}
              onBookingsUpdated={loadAppData}
            />
          ) : (
            <AuthView
              initialMode="login"
              onAuthSuccess={handleAuthSuccess}
              setCurrentPage={navigateTo}
            />
          )
        )}

        {(currentPage === 'admin-dashboard' || currentPage === 'admin-bookings' || currentPage === 'admin-gallery' || currentPage === 'admin-categories' || currentPage === 'admin-services') && (
          currentUser?.role === 'admin' ? (
            <AdminDashboardView
              currentUser={currentUser}
              categories={categories}
              services={services}
              galleryImages={galleryImages}
              setCurrentPage={navigateTo}
              onRefreshData={loadAppData}
              onOpenGuide={() => setIsGuideOpen(true)}
              onOpenDbModal={() => setIsDbSettingsOpen(true)}
            />
          ) : (
            <AuthView
              initialMode="admin-login"
              onAuthSuccess={handleAuthSuccess}
              setCurrentPage={navigateTo}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={navigateTo}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDbModal={() => setIsDbSettingsOpen(true)}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />

      {/* In-App Project Setup & Deployment Guide Modal */}
      <ProjectGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Database Connection & Reset Modal */}
      <DatabaseSettingsModal
        isOpen={isDbSettingsOpen}
        onClose={() => setIsDbSettingsOpen(false)}
        onDataChanged={loadAppData}
      />
    </div>
  );
}
