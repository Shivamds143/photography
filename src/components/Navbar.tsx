import React, { useState } from 'react';
import { Camera, Calendar, User, Shield, Menu, X, ChevronDown, LogOut, Database, HelpCircle } from 'lucide-react';
import { PageView, UserProfile } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenGuide: () => void;
  onOpenDbModal: () => void;
  onSelectCategory?: (slug: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
  onOpenGuide,
  onOpenDbModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Portfolio', page: 'gallery' },
    { label: 'Services', page: 'services' },
    { label: 'Contact', page: 'contact' }
  ];

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#232733] bg-[#0c0d10]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          id="nav-brand-btn"
          onClick={() => handleNavClick('home')}
          className="group flex items-center space-x-3 text-left focus:outline-none"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37] to-[#9a7822] p-0.5 shadow-lg shadow-[#d4af37]/10 transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0c0d10]">
              <Camera className="h-5 w-5 text-[#d4af37] transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-wider text-white">AURA</span>
            <span className="ml-1 text-xs font-medium tracking-[0.25em] text-[#d4af37] uppercase">STUDIO</span>
            <p className="text-[10px] tracking-widest text-slate-400 uppercase">Fine-Art & Editorial</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center space-x-1 md:flex">
          {navLinks.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                id={`nav-link-${item.page}`}
                onClick={() => handleNavClick(item.page)}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'text-[#d4af37]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-[#d4af37] to-[#e6ca65]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden items-center space-x-3 md:flex">
          {/* Documentation Guide button */}
          <button
            id="nav-project-guide-btn"
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 rounded-lg border border-[#2b3040] bg-[#141720] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-[#d4af37]/40 hover:text-white"
            title="Third Year CS Project & Setup Guide"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#d4af37]" />
            <span>Setup & DB Guide</span>
          </button>

          {/* Database status pill */}
          <button
            id="nav-db-status-btn"
            onClick={onOpenDbModal}
            className="flex items-center space-x-1.5 rounded-lg border border-[#2b3040] bg-[#141720] px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
            title="Database Configuration"
          >
            <span className={`h-2 w-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400 animate-pulse'}`} />
            <Database className="h-3 w-3 text-slate-400" />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}</span>
          </button>

          {/* Book a Shoot CTA */}
          <button
            id="nav-book-cta-btn"
            onClick={() => handleNavClick('booking')}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b38c20] px-4 py-2 text-xs font-semibold tracking-wider text-black uppercase shadow-md shadow-[#d4af37]/20 transition-all hover:brightness-110 active:scale-95"
          >
            <Calendar className="h-3.5 w-3.5 text-black" />
            <span>Book a Shoot</span>
          </button>

          {/* User Profile / Login */}
          {currentUser ? (
            <div className="relative">
              <button
                id="nav-user-dropdown-toggle"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 rounded-lg border border-[#272b38] bg-[#13151c] p-1.5 pr-2.5 text-xs text-slate-200 transition-colors hover:border-slate-600"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={currentUser.full_name}
                  className="h-7 w-7 rounded-md object-cover ring-1 ring-[#d4af37]/40"
                />
                <span className="max-w-[90px] truncate font-medium">{currentUser.full_name.split(' ')[0]}</span>
                {currentUser.role === 'admin' && (
                  <span className="rounded bg-[#d4af37]/20 px-1 py-0.5 text-[9px] font-bold text-[#d4af37] uppercase">
                    Admin
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-[#272b38] bg-[#13151c] p-2 shadow-2xl ring-1 ring-black/40">
                  <div className="border-b border-[#232733] px-3 py-2">
                    <p className="text-xs font-medium text-white">{currentUser.full_name}</p>
                    <p className="truncate text-[11px] text-slate-400">{currentUser.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      Role: <strong className="text-[#d4af37]">{currentUser.role}</strong>
                    </span>
                  </div>

                  {currentUser.role === 'admin' ? (
                    <div className="py-1">
                      <button
                        id="nav-admin-dashboard-link"
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-slate-200 hover:bg-[#1f2330] hover:text-[#d4af37]"
                      >
                        <Shield className="h-3.5 w-3.5 text-[#d4af37]" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        id="nav-admin-bookings-link"
                        onClick={() => handleNavClick('admin-bookings')}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-slate-200 hover:bg-[#1f2330]"
                      >
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Manage Bookings</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-1">
                      <button
                        id="nav-customer-dashboard-link"
                        onClick={() => handleNavClick('customer-dashboard')}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-slate-200 hover:bg-[#1f2330] hover:text-[#d4af37]"
                      >
                        <User className="h-3.5 w-3.5 text-[#d4af37]" />
                        <span>My Dashboard</span>
                      </button>
                      <button
                        id="nav-customer-bookings-link"
                        onClick={() => handleNavClick('customer-bookings')}
                        className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-slate-200 hover:bg-[#1f2330]"
                      >
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>My Bookings</span>
                      </button>
                    </div>
                  )}

                  <div className="border-t border-[#232733] pt-1">
                    <button
                      id="nav-user-logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                id="nav-login-btn"
                onClick={() => handleNavClick('login')}
                className="rounded-lg border border-[#272b38] px-3.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
              >
                Sign In
              </button>
              <button
                id="nav-admin-login-shortcut"
                onClick={() => handleNavClick('admin-login')}
                className="flex items-center space-x-1 rounded-lg bg-[#1a1d26] px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-[#d4af37]"
                title="Admin Portal Login"
              >
                <Shield className="h-3 w-3" />
                <span>Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            id="nav-mobile-book-cta"
            onClick={() => handleNavClick('booking')}
            className="rounded bg-[#d4af37] px-2.5 py-1.5 text-[11px] font-bold text-black uppercase"
          >
            Book
          </button>
          <button
            id="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-[#272b38] bg-[#141720] p-2 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#232733] bg-[#0c0d10] px-4 pt-3 pb-6 md:hidden">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium ${
                  currentPage === item.page
                    ? 'bg-[#1a1d26] text-[#d4af37]'
                    : 'text-slate-300 hover:bg-[#141720] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-[#232733] pt-4 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGuide();
              }}
              className="flex w-full items-center space-x-2 rounded-lg bg-[#141720] px-4 py-2.5 text-xs text-slate-200"
            >
              <HelpCircle className="h-4 w-4 text-[#d4af37]" />
              <span>Third Year CS Project & Setup Guide</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDbModal();
              }}
              className="flex w-full items-center space-x-2 rounded-lg bg-[#141720] px-4 py-2.5 text-xs text-slate-300"
            >
              <Database className="h-4 w-4 text-slate-400" />
              <span>Database Status ({isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'})</span>
            </button>

            {currentUser ? (
              <div className="pt-2">
                <div className="rounded-lg bg-[#13151c] p-3 text-xs">
                  <p className="font-semibold text-white">{currentUser.full_name}</p>
                  <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                  <span className="mt-1 inline-block text-[10px] text-[#d4af37] font-mono uppercase">
                    Role: {currentUser.role}
                  </span>
                </div>

                {currentUser.role === 'admin' ? (
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => handleNavClick('admin-dashboard')}
                      className="w-full rounded-lg bg-[#1c202c] px-4 py-2 text-left text-xs font-medium text-[#d4af37]"
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => handleNavClick('admin-bookings')}
                      className="w-full rounded-lg bg-[#141720] px-4 py-2 text-left text-xs text-slate-300"
                    >
                      Manage Bookings
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => handleNavClick('customer-dashboard')}
                      className="w-full rounded-lg bg-[#1c202c] px-4 py-2 text-left text-xs font-medium text-[#d4af37]"
                    >
                      Customer Dashboard
                    </button>
                    <button
                      onClick={() => handleNavClick('customer-bookings')}
                      className="w-full rounded-lg bg-[#141720] px-4 py-2 text-left text-xs text-slate-300"
                    >
                      My Bookings
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="mt-3 flex w-full items-center justify-center space-x-2 rounded-lg bg-red-500/10 py-2 text-xs font-medium text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="rounded-lg border border-[#272b38] bg-[#141720] py-2 text-center text-xs font-medium text-white"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('admin-login')}
                  className="rounded-lg bg-[#1c202c] py-2 text-center text-xs font-medium text-[#d4af37]"
                >
                  Admin Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
