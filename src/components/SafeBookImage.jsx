'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

// Hosts known to serve actual image files
const IMAGE_HOSTS = ['images.unsplash.com', 'i.pinimg.com'];

// Returns true only when the URL is an absolute link that points to
// actual image bytes (known image host or an image file extension).
export const isImageUrl = url => {
  if (typeof url !== 'string' || url.trim() === '') {
    return false;
  }

  try {
    const { protocol, hostname, pathname } = new URL(url.trim());

    if (protocol !== 'https:' && protocol !== 'http:') {
      return false;
    }

    // Pinterest pin pages are HTML pages, not images
    if (/pinterest\./i.test(hostname) && hostname !== 'i.pinimg.com') {
      return false;
    }

    if (IMAGE_HOSTS.includes(hostname)) {
      return true;
    }

    return /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(pathname);
  } catch {
    return false;
  }
};

// Placeholder shown when no valid image can be displayed
export const BookCoverFallback = () => (
  <div className="flex h-full w-full items-center justify-center bg-[#e8e0d2]">
    <BookOpen size={50} className="text-[#173D35]" />
  </div>
);

// Renders the image only when the URL looks like a real image,
// and falls back to the placeholder if the image fails to load.
const SafeBookImage = ({ src, alt, fallback, ...imageProps }) => {
  const safeSrc = isImageUrl(src) ? src.trim() : null;

  // Tracks which URL failed to load; automatically ignored when the
  // src changes to another URL (failedUrl !== safeSrc), so no reset
  // effect is needed.
  const [failedUrl, setFailedUrl] = useState(null);
  const failed = failedUrl !== null && failedUrl === safeSrc;

  if (!safeSrc || failed) {
    return fallback || <BookCoverFallback />;
  }

  return (
    <Image src={safeSrc} alt={alt} onError={() => setFailedUrl(safeSrc)} {...imageProps} />
  );
};

export default SafeBookImage;
