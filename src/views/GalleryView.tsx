import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Eye, 
  Filter, 
  Layers, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Category, GalleryImage } from '../types';

interface GalleryViewProps {
  categories: Category[];
  galleryImages: GalleryImage[];
  selectedCategorySlug: string;
  onSelectCategorySlug: (slug: string) => void;
  onOpenLightbox: (img: GalleryImage) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  categories,
  galleryImages,
  selectedCategorySlug,
  onSelectCategorySlug,
  onOpenLightbox
}) => {
  const [filter, setFilter] = useState<string>(selectedCategorySlug || 'all');
  const [orientationFilter, setOrientationFilter] = useState<string>('all');

  useEffect(() => {
    if (selectedCategorySlug) {
      setFilter(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  const handleFilterChange = (slug: string) => {
    setFilter(slug);
    onSelectCategorySlug(slug);
  };

  const filteredImages = galleryImages.filter((img) => {
    const matchesCategory = filter === 'all' || img.category_slug.toLowerCase() === filter.toLowerCase();
    const matchesOrientation = orientationFilter === 'all' || img.orientation === orientationFilter;
    return matchesCategory && matchesOrientation;
  });

  const activeCategory = categories.find((c) => c.slug.toLowerCase() === filter.toLowerCase());

  return (
    <div className="w-full bg-[#0c0d10] py-12 text-[#f1f3f7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#d4af37]/30 bg-[#161410] px-3.5 py-1 text-xs text-[#d4af37]">
            <Camera className="h-3.5 w-3.5" />
            <span className="font-semibold uppercase tracking-widest">Master Photography Gallery</span>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {activeCategory ? activeCategory.name : 'Visual Portfolio Archive'}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            {activeCategory
              ? activeCategory.description
              : 'Browse across weddings, high-fashion campaigns, fine-art landscapes, and editorial portraits.'}
          </p>
        </div>

        {/* Category Filter Pills & Controls */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-y border-[#1e2330] py-6 sm:flex-row">
          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              id="gallery-filter-all"
              onClick={() => handleFilterChange('all')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                filter === 'all'
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                  : 'border border-[#262b3a] bg-[#12151e] text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              All Works ({galleryImages.length})
            </button>

            {categories.map((cat) => {
              const count = galleryImages.filter((img) => img.category_slug === cat.slug).length;
              const isActive = filter === cat.slug;
              return (
                <button
                  key={cat.id}
                  id={`gallery-filter-${cat.slug}`}
                  onClick={() => handleFilterChange(cat.slug)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20'
                      : 'border border-[#262b3a] bg-[#12151e] text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Orientation Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">Orientation:</span>
            <select
              value={orientationFilter}
              onChange={(e) => setOrientationFilter(e.target.value)}
              className="rounded-lg border border-[#272b38] bg-[#12151e] px-2.5 py-1.5 text-xs text-slate-200 outline-none hover:border-slate-500"
            >
              <option value="all">All Orientations</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="square">Square</option>
            </select>
          </div>
        </div>

        {/* Photography Grid */}
        {filteredImages.length === 0 ? (
          <div className="my-16 rounded-2xl border border-dashed border-[#272b38] p-12 text-center">
            <Layers className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-3 text-sm font-semibold text-slate-300">No photographs found in this category filter</p>
            <button
              onClick={() => handleFilterChange('all')}
              className="mt-3 text-xs text-[#d4af37] hover:underline"
            >
              Reset to view all works
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => onOpenLightbox(img)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#212634] bg-[#12151e] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-2xl hover:shadow-[#d4af37]/10"
              >
                {/* Photo container */}
                <div
                  className={`w-full overflow-hidden ${
                    img.orientation === 'portrait'
                      ? 'aspect-[3/4]'
                      : img.orientation === 'landscape'
                      ? 'aspect-[16/10]'
                      : 'aspect-square'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-95"
                  />
                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
                </div>

                {/* Hover Action Badge */}
                <div className="absolute top-4 right-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-black/60 text-[#d4af37] opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Eye className="h-4 w-4" />
                </div>

                {/* Card Bottom Meta */}
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#d4af37] uppercase">
                      {img.category_name}
                    </span>
                    {img.featured && (
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                    {img.title}
                  </h3>

                  {img.description && (
                    <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                      {img.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2.5 text-[11px] text-slate-400">
                    {img.location ? (
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-[#d4af37]" />
                        <span>{img.location}</span>
                      </span>
                    ) : <span />}

                    {img.camera_specs && (
                      <span className="font-mono text-[10px] text-slate-400 truncate max-w-[190px]">
                        {img.camera_specs.split('•')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
