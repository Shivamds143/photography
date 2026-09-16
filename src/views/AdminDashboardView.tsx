import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Image as ImageIcon, 
  Package, 
  Tag, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Star, 
  Filter, 
  Sparkles,
  FileText,
  Save,
  X,
  HelpCircle,
  Database
} from 'lucide-react';
import { 
  UserProfile, 
  Booking, 
  GalleryImage, 
  PhotographyService, 
  Category, 
  PageView 
} from '../types';
import { db } from '../lib/databaseService';

interface AdminDashboardViewProps {
  currentUser: UserProfile;
  categories: Category[];
  services: PhotographyService[];
  galleryImages: GalleryImage[];
  setCurrentPage: (page: PageView) => void;
  onRefreshData: () => void;
  onOpenGuide?: () => void;
  onOpenDbModal?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  categories,
  services,
  galleryImages,
  setCurrentPage,
  onRefreshData,
  onOpenGuide,
  onOpenDbModal
}) => {
  // Guard check: ensure role is admin
  if (currentUser.role !== 'admin') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#0c0d10] px-4 text-center">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-[#140e0e] p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 font-serif text-2xl font-bold text-white">Administrative Access Required</h2>
          <p className="mt-2 text-xs text-slate-400">
            Your current profile ({currentUser.email}) is registered as a customer. Please sign in with an administrator account to view the studio management console.
          </p>
          <button
            onClick={() => setCurrentPage('admin-login')}
            className="mt-6 rounded-xl bg-[#d4af37] px-6 py-2.5 text-xs font-bold text-black uppercase hover:brightness-110"
          >
            Switch to Admin Sign-In
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'bookings' | 'gallery' | 'services' | 'categories'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState<string>('');
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<Booking | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  // Gallery Management State
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [newImageForm, setNewImageForm] = useState({
    title: '',
    image_url: '',
    category_slug: categories[0]?.slug || 'wedding',
    category_name: categories[0]?.name || 'Wedding',
    description: '',
    location: '',
    camera_specs: 'Sony A1 • 50mm f/1.2 GM',
    orientation: 'portrait' as 'portrait' | 'landscape' | 'square',
    featured: true
  });

  // Service Management State
  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    title: '',
    category_slug: categories[0]?.slug || 'wedding',
    category_name: categories[0]?.name || 'Wedding',
    price: 1200,
    duration_minutes: 180,
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    features: ['High-resolution digital downloads', 'Professional color grading', 'Private online gallery'],
    featuresText: 'High-resolution digital downloads\nProfessional color grading\nPrivate online gallery',
    is_popular: false
  });

  // Fetch all bookings
  const loadAllBookings = async () => {
    const data = await db.getAllBookings();
    setBookings(data);
  };

  useEffect(() => {
    loadAllBookings();
  }, []);

  // Booking actions
  const handleUpdateStatus = async (bookingId: string, status: Booking['status']) => {
    const updated = await db.updateBookingStatus(bookingId, status);
    if (updated) {
      await loadAllBookings();
      onRefreshData();
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBookingForNotes) return;
    await db.updateBookingNotes(selectedBookingForNotes.id, noteInput);
    setSelectedBookingForNotes(null);
    setNoteInput('');
    await loadAllBookings();
  };

  // Image actions
  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.slug === newImageForm.category_slug);
    await db.createGalleryImage({
      ...newImageForm,
      category_name: cat?.name || newImageForm.category_name
    });
    setIsAddingImage(false);
    setNewImageForm({
      title: '',
      image_url: '',
      category_slug: categories[0]?.slug || 'wedding',
      category_name: categories[0]?.name || 'Wedding',
      description: '',
      location: '',
      camera_specs: 'Sony A1 • 50mm f/1.2 GM',
      orientation: 'portrait',
      featured: true
    });
    onRefreshData();
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photograph from the portfolio?')) return;
    await db.deleteGalleryImage(id);
    onRefreshData();
  };

  const handleToggleFeatured = async (img: GalleryImage) => {
    await db.updateGalleryImage(img.id, { featured: !img.featured });
    onRefreshData();
  };

  // Service actions
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.slug === newServiceForm.category_slug);
    const parsedFeatures = newServiceForm.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    await db.createService({
      title: newServiceForm.title,
      slug: newServiceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category_id: cat?.id || 'cat-1',
      category_slug: newServiceForm.category_slug,
      category_name: cat?.name || newServiceForm.category_name,
      price: Number(newServiceForm.price),
      duration_minutes: Number(newServiceForm.duration_minutes),
      description: newServiceForm.description,
      cover_image: newServiceForm.cover_image,
      features: parsedFeatures,
      is_popular: newServiceForm.is_popular
    });

    setIsAddingService(false);
    onRefreshData();
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service package?')) return;
    await db.deleteService(id);
    onRefreshData();
  };

  // Stats calculation
  const totalRevenuePipeline = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.service_price || 0), 0);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesSearch =
      bookingSearch === '' ||
      b.customer_name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.service_title.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full bg-[#0c0d10] py-10 text-[#f1f3f7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Strip */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1f2432] pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-6 items-center rounded-full bg-[#d4af37]/20 px-2.5 text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Administrative Suite
              </span>
              <span className="text-xs text-slate-500">Logged in as {currentUser.email}</span>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
              Studio Management Dashboard
            </h1>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenGuide && (
              <button
                id="admin-open-guide-btn"
                onClick={onOpenGuide}
                className="flex items-center space-x-1.5 rounded-xl border border-[#2b3040] bg-[#141720] px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-[#d4af37]/40 hover:text-white"
              >
                <HelpCircle className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>Setup &amp; DB Guide</span>
              </button>
            )}
            {onOpenDbModal && (
              <button
                id="admin-open-db-btn"
                onClick={onOpenDbModal}
                className="flex items-center space-x-1.5 rounded-xl border border-[#2b3040] bg-[#141720] px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                <Database className="h-3.5 w-3.5 text-slate-400" />
                <span>Database Settings</span>
              </button>
            )}
            <button
              onClick={() => setCurrentPage('home')}
              className="rounded-xl border border-slate-700 bg-[#12151e] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            >
              Exit to Live Site
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Pending Requests</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-amber-300">{pendingBookingsCount}</p>
            <p className="mt-1 text-[11px] text-slate-500">Requires review/confirmation</p>
          </div>

          <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Confirmed Shoots</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-emerald-400">{confirmedBookingsCount}</p>
            <p className="mt-1 text-[11px] text-slate-500">Upcoming calendar dates</p>
          </div>

          <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Confirmed Pipeline</span>
              <DollarSign className="h-4 w-4 text-[#d4af37]" />
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-white">${totalRevenuePipeline.toLocaleString()}</p>
            <p className="mt-1 text-[11px] text-slate-500">From confirmed/completed commissions</p>
          </div>

          <div className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Active Portfolio Works</span>
              <ImageIcon className="h-4 w-4 text-purple-400" />
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-white">{galleryImages.length}</p>
            <p className="mt-1 text-[11px] text-slate-500">{categories.length} active categories</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-10 border-b border-[#1e2330]">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center space-x-2 border-b-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'bookings'
                  ? 'border-[#d4af37] text-[#d4af37]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-2 border-b-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'gallery'
                  ? 'border-[#d4af37] text-[#d4af37]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Portfolio Gallery ({galleryImages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center space-x-2 border-b-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'services'
                  ? 'border-[#d4af37] text-[#d4af37]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Services Packages ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center space-x-2 border-b-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'categories'
                  ? 'border-[#d4af37] text-[#d4af37]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>Categories ({categories.length})</span>
            </button>
          </nav>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="mt-8">
            {/* Filter and Search Bar */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              {/* Status Pills */}
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                      bookingStatusFilter === st
                        ? 'bg-[#d4af37] text-black shadow'
                        : 'border border-[#262b3a] bg-[#12151e] text-slate-400 hover:text-white'
                    }`}
                  >
                    {st} (
                    {st === 'all' ? bookings.length : bookings.filter((b) => b.status === st).length}
                    )
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="flex items-center rounded-xl border border-[#272b38] bg-[#12151e] px-3 py-1.5 text-xs text-white">
                <Search className="mr-2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search client, email, service..."
                  className="w-48 bg-transparent outline-none placeholder:text-slate-600 sm:w-64"
                />
              </div>
            </div>

            {/* Bookings Table */}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[#212634] bg-[#12151e]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#1f2432] bg-[#090b10] text-slate-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Package / Price</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Notes / Message</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2432]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No bookings match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#161a25]/60 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{b.customer_name}</p>
                          <p className="text-[11px] text-slate-400">{b.customer_email}</p>
                          <p className="text-[11px] text-slate-500">{b.customer_phone}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{b.service_title}</p>
                          <p className="font-mono text-[#d4af37] font-bold">${b.service_price} USD</p>
                        </td>
                        <td className="p-4">
                          <p className="text-white flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-[#d4af37]" />
                            <span>{b.booking_date}</span>
                          </p>
                          <p className="text-[11px] text-slate-400">{b.time_slot}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{b.location}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : b.status === 'completed'
                                ? 'bg-blue-500/15 text-blue-400'
                                : b.status === 'cancelled'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-amber-500/15 text-amber-300'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          {b.message && (
                            <p className="text-[11px] text-slate-300 line-clamp-1 italic">
                              "{b.message}"
                            </p>
                          )}
                          {b.notes ? (
                            <p className="mt-1 text-[11px] text-[#d4af37] line-clamp-1">
                              Note: {b.notes}
                            </p>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedBookingForNotes(b);
                                setNoteInput(b.notes || '');
                              }}
                              className="mt-1 text-[11px] text-slate-500 hover:text-slate-300"
                            >
                              + Add Studio Note
                            </button>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                className="rounded-lg bg-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/30"
                              >
                                Decline
                              </button>
                            </>
                          )}

                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'completed')}
                              className="rounded-lg bg-blue-500/20 px-2.5 py-1 text-[11px] font-semibold text-blue-300 hover:bg-blue-500/30"
                            >
                              Mark Completed
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedBookingForNotes(b);
                              setNoteInput(b.notes || '');
                            }}
                            className="rounded-lg border border-slate-700 bg-[#181b24] p-1.5 text-slate-300 hover:text-white"
                            title="Edit Studio Notes"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO & GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Curated Portfolio Images</h3>
                <p className="text-xs text-slate-400">Upload new photography works, assign categories, and update EXIF.</p>
              </div>
              <button
                onClick={() => setIsAddingImage(true)}
                className="flex items-center space-x-1.5 rounded-xl bg-[#d4af37] px-4 py-2 text-xs font-bold uppercase text-black hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                <span>Add Photograph</span>
              </button>
            </div>

            {/* Upload Modal */}
            {isAddingImage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                <div className="w-full max-w-lg rounded-3xl border border-[#272b38] bg-[#12151e] p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#1f2432] pb-3">
                    <h4 className="font-serif text-lg font-bold text-white">Add New Photograph</h4>
                    <button onClick={() => setIsAddingImage(false)} className="text-slate-400 hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateImage} className="mt-4 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300">Photo Title *</label>
                      <input
                        type="text"
                        required
                        value={newImageForm.title}
                        onChange={(e) => setNewImageForm({ ...newImageForm, title: e.target.value })}
                        placeholder="Golden Hour Vows in Tuscany"
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300">Image URL (Unsplash or Direct CDN) *</label>
                      <input
                        type="url"
                        required
                        value={newImageForm.image_url}
                        onChange={(e) => setNewImageForm({ ...newImageForm, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300">Category *</label>
                        <select
                          value={newImageForm.category_slug}
                          onChange={(e) => setNewImageForm({ ...newImageForm, category_slug: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300">Orientation</label>
                        <select
                          value={newImageForm.orientation}
                          onChange={(e) =>
                            setNewImageForm({
                              ...newImageForm,
                              orientation: e.target.value as 'portrait' | 'landscape' | 'square'
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        >
                          <option value="portrait">Portrait (Vertical)</option>
                          <option value="landscape">Landscape (Horizontal)</option>
                          <option value="square">Square</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300">Location</label>
                        <input
                          type="text"
                          value={newImageForm.location}
                          onChange={(e) => setNewImageForm({ ...newImageForm, location: e.target.value })}
                          placeholder="Florence, Italy"
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300">Camera Specs / EXIF</label>
                        <input
                          type="text"
                          value={newImageForm.camera_specs}
                          onChange={(e) => setNewImageForm({ ...newImageForm, camera_specs: e.target.value })}
                          placeholder="Sony A1 • 50mm f/1.2 • ISO 100"
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300">Story / Description</label>
                      <textarea
                        rows={2}
                        value={newImageForm.description}
                        onChange={(e) => setNewImageForm({ ...newImageForm, description: e.target.value })}
                        placeholder="Brief artistic notes about the frame..."
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="new-img-featured"
                        checked={newImageForm.featured}
                        onChange={(e) => setNewImageForm({ ...newImageForm, featured: e.target.checked })}
                        className="rounded border-slate-700 bg-slate-900 text-[#d4af37]"
                      />
                      <label htmlFor="new-img-featured" className="text-xs text-slate-300">
                        Feature in homepage curated showcase
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-[#1f2432]">
                      <button
                        type="button"
                        onClick={() => setIsAddingImage(false)}
                        className="rounded-xl border border-slate-700 bg-[#161922] px-4 py-2 text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-[#d4af37] px-5 py-2 font-bold text-black uppercase hover:brightness-110"
                      >
                        Publish Photo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#212634] bg-[#12151e] shadow-xl"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#d4af37] uppercase">
                        {img.category_name}
                      </span>
                      <button
                        onClick={() => handleToggleFeatured(img)}
                        className={`flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          img.featured
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Star className="h-3 w-3" />
                        <span>{img.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </div>

                    <h4 className="mt-1 font-serif text-base font-bold text-white">{img.title}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{img.location || 'Studio'}</p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#1f2432] pt-3 text-xs">
                      <span className="font-mono text-[10px] text-slate-500">
                        {img.orientation}
                      </span>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="flex items-center space-x-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Photography Packages</h3>
                <p className="text-xs text-slate-400">Configure pricing, durations, inclusions, and featured status.</p>
              </div>
              <button
                onClick={() => setIsAddingService(true)}
                className="flex items-center space-x-1.5 rounded-xl bg-[#d4af37] px-4 py-2 text-xs font-bold uppercase text-black hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                <span>Add Package</span>
              </button>
            </div>

            {isAddingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                <div className="w-full max-w-lg rounded-3xl border border-[#272b38] bg-[#12151e] p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#1f2432] pb-3">
                    <h4 className="font-serif text-lg font-bold text-white">Create Service Package</h4>
                    <button onClick={() => setIsAddingService(false)} className="text-slate-400 hover:text-white">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateService} className="mt-4 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={newServiceForm.title}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                        placeholder="Elopement Romance Collection"
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300">Category</label>
                        <select
                          value={newServiceForm.category_slug}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, category_slug: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300">Price (USD) *</label>
                        <input
                          type="number"
                          required
                          value={newServiceForm.price}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, price: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300">Duration (Minutes)</label>
                        <input
                          type="number"
                          value={newServiceForm.duration_minutes}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, duration_minutes: Number(e.target.value) })}
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300">Cover Image URL</label>
                        <input
                          type="url"
                          value={newServiceForm.cover_image}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, cover_image: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300">Description</label>
                      <textarea
                        rows={2}
                        value={newServiceForm.description}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                        placeholder="Comprehensive coverage details..."
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300">Inclusions (one per line)</label>
                      <textarea
                        rows={3}
                        value={newServiceForm.featuresText}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, featuresText: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#262b3a] bg-[#090b10] p-2.5 text-white font-mono text-[11px] outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="new-srv-popular"
                        checked={newServiceForm.is_popular}
                        onChange={(e) => setNewServiceForm({ ...newServiceForm, is_popular: e.target.checked })}
                      />
                      <label htmlFor="new-srv-popular" className="text-slate-300">
                        Mark as Signature / Popular Package
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-[#1f2432]">
                      <button
                        type="button"
                        onClick={() => setIsAddingService(false)}
                        className="rounded-xl border border-slate-700 bg-[#161922] px-4 py-2 text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-[#d4af37] px-5 py-2 font-bold text-black uppercase hover:brightness-110"
                      >
                        Save Package
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className="rounded-2xl border border-[#212634] bg-[#12151e] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#d4af37] uppercase">{s.category_name}</span>
                    {s.is_popular && (
                      <span className="rounded bg-[#d4af37] px-2 py-0.5 text-[9px] font-bold text-black uppercase">
                        Signature
                      </span>
                    )}
                  </div>

                  <h4 className="mt-2 font-serif text-xl font-bold text-white">{s.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{s.description}</p>

                  <div className="mt-4 flex items-baseline justify-between border-y border-[#1f2432] py-3 text-xs">
                    <span className="font-serif text-2xl font-bold text-white">${s.price}</span>
                    <span className="text-slate-400">{Math.round(s.duration_minutes / 60)} Hours</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{s.features.length} inclusions</span>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="mt-8">
            <h3 className="font-serif text-xl font-bold text-white">Photography Disciplines & Collections</h3>
            <p className="text-xs text-slate-400">Manage categories used to tag photographs and services.</p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <div key={c.id} className="rounded-2xl border border-[#212634] bg-[#12151e] p-5">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                    <img src={c.cover_image} alt={c.name} className="h-full w-full object-cover" />
                  </div>
                  <h4 className="mt-3 font-serif text-lg font-bold text-white">{c.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                  <p className="mt-3 font-mono text-[10px] text-[#d4af37]">slug: /{c.slug}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Studio Note Modal */}
        {selectedBookingForNotes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl border border-[#272b38] bg-[#10131c] p-6 shadow-2xl">
              <h4 className="font-serif text-lg font-bold text-white">
                Studio Notes for {selectedBookingForNotes.customer_name}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedBookingForNotes.service_title} • {selectedBookingForNotes.booking_date}
              </p>

              <textarea
                rows={4}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="e.g. Deposit received, requested 2 extra hours of sunset coverage, confirmed backup gear..."
                className="mt-4 w-full rounded-xl border border-[#272b38] bg-[#080a0e] p-3 text-xs text-white outline-none focus:border-[#d4af37]"
              />

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedBookingForNotes(null)}
                  className="rounded-xl border border-slate-700 bg-[#161922] px-4 py-2 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="rounded-xl bg-[#d4af37] px-5 py-2 text-xs font-bold text-black uppercase hover:brightness-110"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
