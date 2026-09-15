import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Tag, ZoomIn, ZoomOut } from 'lucide-react';
import { GalleryImage } from '../types';

interface LightboxModalProps {
  image: GalleryImage | null;
  images: GalleryImage[];
  onClose: () => void;
  onNavigate: (image: GalleryImage) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  images,
  onClose,
  onNavigate
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!image) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const currentIndex = images.findIndex((img) => img.id === image.id);
        if (currentIndex < images.length - 1) {
          onNavigate(images[currentIndex + 1]);
        } else {
          onNavigate(images[0]); // loop
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = images.findIndex((img) => img.id === image.id);
        if (currentIndex > 0) {
          onNavigate(images[currentIndex - 1]);
        } else {
          onNavigate(images[images.length - 1]); // loop
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, images, onClose, onNavigate]);

  if (!image) return null;

  const currentIndex = images.findIndex((img) => img.id === image.id);
  const prevImage = currentIndex > 0 ? images[currentIndex - 1] : images[images.length - 1];
  const nextImage = currentIndex < images.length - 1 ? images[currentIndex + 1] : images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all">
      {/* Top Action Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-semibold text-[#d4af37]">
            {image.category_name}
          </span>
          <span className="text-xs text-slate-400">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="lightbox-zoom-toggle"
            onClick={() => setIsZoomed(!isZoomed)}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            title={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>
          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            title="Close Lightbox (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Prev / Next Nav Buttons */}
      <button
        id="lightbox-prev-btn"
        onClick={() => onNavigate(prevImage)}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
        title="Previous Photo (Left Arrow)"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        id="lightbox-next-btn"
        onClick={() => onNavigate(nextImage)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 active:scale-95"
        title="Next Photo (Right Arrow)"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Image Display Area */}
      <div 
        className="relative flex h-full max-h-[82vh] w-full max-w-6xl items-center justify-center p-4 sm:p-8"
        onClick={() => isZoomed && setIsZoomed(false)}
      >
        <img
          src={image.image_url}
          alt={image.title}
          className={`max-h-full max-w-full rounded-md object-contain shadow-2xl transition-transform duration-300 ${
            isZoomed ? 'cursor-zoom-out scale-125' : 'cursor-zoom-in'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
        />
      </div>

      {/* Bottom Metadata Bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 border-t border-white/10 bg-black/60 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wide text-white">{image.title}</h3>
            {image.description && (
              <p className="mt-0.5 text-xs text-slate-300">{image.description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            {image.location && (
              <div className="flex items-center space-x-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>{image.location}</span>
              </div>
            )}
            {image.camera_specs && (
              <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-300">
                <Camera className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>{image.camera_specs}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
