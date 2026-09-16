import React, { useState, useEffect, useRef } from 'react';
import { Camera, Calendar, User, Shield, Menu, X, ChevronDown, LogOut, Database, HelpCircle } from 'lucide-react';
import { PageView, UserProfile } from '../types';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenGuide?: () => void;
  onOpenDbModal?: () => void;
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Portfolio', page: 'gallery' },
    { label: 'Services', page: 'services' },
    { label: 'Contact', page: 'contact' }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#202430] bg-[#0c0d10]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          id="nav-brand-btn"
          onClick={() => handleNavClick('home')}
          className="group flex items-center space-x-3 text-left focus:outline-none"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37] via-[#c59e2b] to-[#8a681c] p-0.5 shadow-lg shadow-[#d4af37]/10 transition-transform duration-300 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0c0d10]">
              <Camera className="h-5 w-5 text-[#d4af37] transition-transform duration-300 group-hover:rotate-12" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">AURA</span>
              <span className="text-xs font-semibold tracking-[0.25em] text-[#d4af37] uppercase">STUDIO</span>
            </div>
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
                  <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden items-center space-x-3 md:flex">
          {/* Book a Shoot CTA */}
          <button
            id="nav-book-cta-btn"
            onClick={() => handleNavClick('booking')}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59e2b] to-[#b38c20] px-4 py-2 text-xs font-bold tracking-wider text-black uppercase shadow-md shadow-[#d4af37]/20 transition-all hover:brightness-110 active:scale-95"
          >
            <Calendar className="h-3.5 w-3.5 text-black" />
            <span>Book a Shoot</span>
          </button>

          {/* User Profile / Login */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              {currentUser.role === 'admin' ? (
                /* Admin trigger */
                <button
                  id="nav-user-dropdown-toggle"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 rounded-xl border border-[#d4af37]/40 bg-[#16140e] p-1.5 pr-2.5 text-xs text-slate-200 transition-all hover:border-[#d4af37] hover:bg-[#1f1a10]"
                  title="Admin Dashboard"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d4af37] text-black">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <span className="block max-w-[90px] truncate text-xs font-semibold text-white">
                      {currentUser.full_name.split(' ')[0]}
                    </span>
                    <span className="block text-[9px] font-bold text-[#d4af37] tracking-wider uppercase">
                      Admin
                    </span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-[#d4af37] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                /* Customer trigger */
                <button
                  id="nav-user-dropdown-toggle"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 rounded-xl border border-[#272b38] bg-[#13151c] p-1.5 pr-2.5 text-xs text-slate-200 transition-all hover:border-[#d4af37]/50 hover:bg-[#181b26]"
                  title="Profile / Dashboard"
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser.full_name}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-[#d4af37]/40"
                  />
                  <div className="text-left">
                    <span className="block max-w-[90px] truncate text-xs font-semibold text-white">
                      {currentUser.full_name.split(' ')[0]}
                    </span>
                    <span className="block text-[9px] text-[#d4af37] tracking-wider uppercase">
                      Dashboard
                    </span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-[#272b38] bg-[#12141c]/95 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/50">
                  <div className="border-b border-[#232733] px-3.5 py-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">{currentUser.full_name}</p>
                      {currentUser.role === 'admin' && (
                        <span className="rounded bg-[#d4af37]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#d4af37] uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-slate-400">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'admin' ? (
                    <div className="py-1.5 space-y-0.5">
                      <button
                        id="nav-admin-dashboard-link"
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1c202c] hover:text-[#d4af37] transition-colors"
                      >
                        <Shield className="h-3.5 w-3.5 text-[#d4af37]" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        id="nav-admin-bookings-link"
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1c202c] transition-colors"
                      >
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Manage Bookings</span>
                      </button>
                      {onOpenGuide && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenGuide();
                          }}
                          className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1c202c] hover:text-white transition-colors"
                        >
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                          <span>Project & DB Guide</span>
                        </button>
                      )}
                      {onOpenDbModal && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenDbModal();
                          }}
                          className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1c202c] hover:text-white transition-colors"
                        >
                          <Database className="h-3.5 w-3.5 text-slate-400" />
                          <span>Database Settings</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="py-1.5 space-y-0.5">
                      <button
                        id="nav-customer-dashboard-link"
                        onClick={() => handleNavClick('customer-dashboard')}
                        className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1c202c] hover:text-[#d4af37] transition-colors"
                      >
                        <User className="h-3.5 w-3.5 text-[#d4af37]" />
                        <span>Profile & Dashboard</span>
                      </button>
                      <button
                        id="nav-customer-bookings-link"
                        onClick={() => handleNavClick('customer-bookings')}
                        className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-slate-200 hover:bg-[#1c202c] transition-colors"
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
                      className="flex w-full items-center space-x-2.5 rounded-lg px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out user: Clean Login/Register button */
            <div className="flex items-center space-x-2">
              <button
                id="nav-login-btn"
                onClick={() => handleNavClick('login')}
                className="flex items-center space-x-1.5 rounded-xl border border-[#272b38] bg-[#12141c] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-[#d4af37]/60 hover:bg-[#181b24] hover:text-white"
              >
                <User className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>Login / Register</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle & Compact Book CTA */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            id="nav-mobile-book-cta"
            onClick={() => handleNavClick('booking')}
            className="rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b38c20] px-3 py-1.5 text-xs font-bold text-black uppercase shadow-sm"
          >
            Book
          </button>
          <button
            id="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#272b38] bg-[#141720] text-slate-300 transition-colors hover:border-[#d4af37]/40 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-[#d4af37]" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#232733] bg-[#0c0d10] px-4 pt-3 pb-6 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-[#181b24] text-[#d4af37]'
                    : 'text-slate-300 hover:bg-[#141720] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-[#232733] pt-4 space-y-3">
            {/* Book a Shoot Full CTA */}
            <button
              onClick={() => handleNavClick('booking')}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59e2b] to-[#b38c20] py-3 text-xs font-bold tracking-wider text-black uppercase shadow-lg shadow-[#d4af37]/15"
            >
              <Calendar className="h-4 w-4 text-black" />
              <span>Book a Shoot</span>
            </button>

            {currentUser ? (
              <div className="rounded-xl border border-[#232733] bg-[#12141c] p-3.5">
                <div className="flex items-center space-x-3">
                  {currentUser.role === 'admin' ? (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4af37] text-black">
                      <Shield className="h-5 w-5" />
                    </div>
                  ) : (
                    <img
                      src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                      alt={currentUser.full_name}
                      className="h-9 w-9 rounded-lg object-cover ring-1 ring-[#d4af37]/40"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-white text-xs truncate">{currentUser.full_name}</p>
                      {currentUser.role === 'admin' && (
                        <span className="rounded bg-[#d4af37]/20 px-1.5 py-0.2 text-[9px] font-bold text-[#d4af37] uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 border-t border-[#1e222e] pt-3">
                  {currentUser.role === 'admin' ? (
                    <>
                      <button
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="flex w-full items-center space-x-2 rounded-lg bg-[#221e14] px-3.5 py-2.5 text-xs font-semibold text-[#d4af37]"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="flex w-full items-center space-x-2 rounded-lg bg-[#141720] px-3.5 py-2.5 text-xs text-slate-300"
                      >
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Manage Bookings</span>
                      </button>
                      {onOpenGuide && (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onOpenGuide();
                          }}
                          className="flex w-full items-center space-x-2 rounded-lg bg-[#141720] px-3.5 py-2.5 text-xs text-slate-300"
                        >
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                          <span>Project Setup Guide</span>
                        </button>
                      )}
                      {onOpenDbModal && (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onOpenDbModal();
                          }}
                          className="flex w-full items-center space-x-2 rounded-lg bg-[#141720] px-3.5 py-2.5 text-xs text-slate-300"
                        >
                          <Database className="h-3.5 w-3.5 text-slate-400" />
                          <span>Database Settings</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavClick('customer-dashboard')}
                        className="flex w-full items-center space-x-2 rounded-lg bg-[#1a1d26] px-3.5 py-2.5 text-xs font-medium text-[#d4af37]"
                      >
                        <User className="h-3.5 w-3.5" />
                        <span>Profile & Dashboard</span>
                      </button>
                      <button
                        onClick={() => handleNavClick('customer-bookings')}
                        className="flex w-full items-center space-x-2 rounded-lg bg-[#141720] px-3.5 py-2.5 text-xs text-slate-300"
                      >
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>My Bookings</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-500/10 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors mt-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center justify-center space-x-2 rounded-xl border border-[#272b38] bg-[#141720] py-2.5 text-center text-xs font-semibold text-white hover:border-[#d4af37]/40"
                >
                  <User className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="flex items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#1a1710] py-2.5 text-center text-xs font-semibold text-[#d4af37] hover:bg-[#d4af37]/10"
                >
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
