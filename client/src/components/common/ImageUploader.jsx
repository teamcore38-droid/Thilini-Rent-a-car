import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export const ImageUploader = ({
  images = [],
  onChange,
  folder = 'thilini_rent_a_car/vehicles',
  maxImages = 8
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images per vehicle.`);
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      if (files.length === 1) {
        const res = await uploadService.uploadSingleImage(files[0], folder);
        if (res?.image?.url) {
          const updated = [...images, res.image.url];
          onChange(updated);
          setSuccess('Image uploaded and optimized on Cloudinary!');
        }
      } else {
        const res = await uploadService.uploadMultipleImages(files, folder);
        if (res?.images?.length) {
          const newUrls = res.images.map((img) => img.url);
          const updated = [...images, ...newUrls];
          onChange(updated);
          setSuccess(`${res.images.length} images uploaded & optimized on Cloudinary!`);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(
        err.response?.data?.message ||
          'Failed to upload to Cloudinary. Check your Cloudinary API keys in .env.'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimary = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    const selected = images[indexToPrimary];
    const rest = images.filter((_, idx) => idx !== indexToPrimary);
    onChange([selected, ...rest]);
  };

  const handleAddManualUrl = (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    if (images.length >= maxImages) {
      setError(`Maximum of ${maxImages} images allowed.`);
      return;
    }

    onChange([...images, manualUrl.trim()]);
    setManualUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-xs text-charcoal-900 uppercase tracking-wider">
          Vehicle Gallery Photos ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide URL input' : 'Add image via URL'}</span>
        </button>
      </div>

      {/* Manual URL input fallback */}
      {showUrlInput && (
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste Cloudinary / image URL (e.g. https://res.cloudinary.com/...)"
            className="flex-1 text-xs bg-white border border-gray-200 rounded-xl px-3 py-2"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-4 py-2 bg-charcoal-900 text-white rounded-xl text-xs font-bold hover:bg-charcoal-800"
          >
            Add
          </button>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((imgUrl, idx) => {
          const isCloudinary = imgUrl.includes('res.cloudinary.com');
          return (
            <div
              key={idx}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm"
            >
              <img
                src={getOptimizedImageUrl(imgUrl, { width: 300, height: 225, crop: 'fill' })}
                alt={`Vehicle ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Primary badge */}
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow">
                  Cover
                </span>
              )}

              {/* Cloudinary CDN badge */}
              {isCloudinary && (
                <span
                  title="Delivered via Cloudinary Global CDN (Auto WebP / AVIF)"
                  className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>CDN</span>
                </span>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Set as Cover Photo"
                    className="p-1.5 bg-white text-charcoal-900 rounded-lg hover:bg-gray-100 text-[10px] font-bold shadow"
                  >
                    Set Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  title="Remove image"
                  className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Upload Button Tile */}
        {images.length < maxImages && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 hover:border-brand-500 hover:bg-brand-50/30 transition-all flex flex-col items-center justify-center p-3 text-center group disabled:opacity-50"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-1.5 text-brand-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-[11px] font-bold">Uploading & Optimizing...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-charcoal-800">Upload Photos</span>
                <span className="text-[10px] text-gray-400">Auto WebP / AVIF</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
