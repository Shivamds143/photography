import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, ZoomIn, ZoomOut, Loader2, AlertCircle } from 'lucide-react';
import { GalleryImage } from '../types';

interface LightboxModalProps {
  image: GalleryImage | null;
  images?: GalleryImage[];
  onClose: () => void;
  onNavigate?: (image: GalleryImage) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  images = [],
  onClose,
  onNavigate
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Safe list of images for navigation
  const imageList = images && images.length > 0 ? images : image ? [image] : [];
  const currentIndex = image ? imageList.findIndex((img) => img.id === image.id) : -1;
  const hasMultiple = imageList.length > 1;

  const prevImage = hasMultiple && currentIndex > 0 
    ? imageList[currentIndex - 1] 
    : imageList[imageList.length - 1];

  const nextImage = hasMultiple && currentIndex < imageList.length - 1 
    ? imageList[currentIndex + 1] 
    : imageList[0];

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsZoomed(false);
  }, [image?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!image) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasMultiple && onNavigate && nextImage) {
        onNavigate(nextImage);
      } else if (e.key === 'ArrowLeft' && hasMultiple && onNavigate && prevImage) {
        onNavigate(prevImage);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, hasMultiple, nextImage, prevImage, onClose, onNavigate]);

  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Action Bar */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          {image.category_name && (
            <span className="rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 px-3 py-1 text-xs font-semibold text-[#d4af37]">
              {image.category_name}
            </span>
          )}
          {hasMultiple && currentIndex >= 0 && (
            <span className="text-xs text-slate-400">
              {currentIndex + 1} of {imageList.length}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!hasError && (
            <button
              id="lightbox-zoom-toggle"
              onClick={() => setIsZoomed(!isZoomed)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-all hover:border-[#d4af37]/40 hover:bg-white/10 hover:text-white"
              title={isZoomed ? 'Zoom Out' : 'Zoom In'}
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </button>
          )}
          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            title="Close Lightbox (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Prev / Next Nav Buttons */}
      {hasMultiple && onNavigate && prevImage && (
        <button
          id="lightbox-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(prevImage);
          }}
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/15 bg-black/60 p-3.5 text-white backdrop-blur-md transition-all hover:border-[#d4af37] hover:bg-black/90 hover:scale-110 active:scale-95 shadow-xl"
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {hasMultiple && onNavigate && nextImage && (
        <button
          id="lightbox-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(nextImage);
          }}
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/15 bg-black/60 p-3.5 text-white backdrop-blur-md transition-all hover:border-[#d4af37] hover:bg-black/90 hover:scale-110 active:scale-95 shadow-xl"
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image Display Area */}
      <div 
        className="relative flex h-full max-h-[82vh] w-full max-w-6xl items-center justify-center p-4 sm:p-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
            <span className="text-xs tracking-wider text-slate-400 uppercase">Loading Masterwork...</span>
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-400" />
            <h3 className="mt-3 font-serif text-lg font-bold text-white">{image.title}</h3>
            <p className="mt-1 text-xs text-slate-400">Photograph preview is temporarily unavailable.</p>
          </div>
        ) : (
          <img
            src={image.image_url}
            alt={image.title}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className={`max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-all duration-300 ${
              isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            } ${isZoomed ? 'cursor-zoom-out scale-125' : 'cursor-zoom-in'}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          />
        )}
      </div>

      {/* Bottom Metadata Bar */}
      <div className="absolute bottom-0 inset-x-0 z-30 border-t border-white/10 bg-black/70 px-6 py-4 backdrop-blur-md">
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
