import { useState } from 'react';

export default function ImageWithFallback({ 
  src, 
  alt = 'Image', 
  className = '',
  width,
  height,
  onError,
  ...props 
}) {
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  if (hasError) {
    return (
      <div
        style={{
          width: width || '100%',
          height: height || '100%',
          backgroundColor: '#f3ede5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px'
        }}
        className={className}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          style={{ color: '#a89968', opacity: 0.5 }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      width={width}
      height={height}
      {...props}
    />
  );
}
