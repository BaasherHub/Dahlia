import { useEffect, useRef, useState } from 'react';

export default function LazyImage({ src, alt, className, ...props }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageRef) return;

    // Use native lazy loading first
    if ('loading' in HTMLImageElement.prototype) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // Fallback to Intersection Observer
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            setIsLoading(false);
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(imageRef);
    return () => observer.disconnect();
  }, [imageRef, src]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onLoad={handleImageLoad}
      onError={handleImageError}
      {...props}
      style={{
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
      }}
    />
  );
}
