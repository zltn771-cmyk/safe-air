import React, { useState } from 'react';
import { FALLBACK_SVGS } from '../../config/environmentalImagesConfig';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'wildfire' | 'clean' | 'haze' | 'mask' | 'room';
  alt: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackType = 'wildfire',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const targetSrc = hasError ? FALLBACK_SVGS[fallbackType] : src;

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <span className="text-[10px] text-slate-500 font-mono">Memuat visual...</span>
        </div>
      )}
      <img
        src={targetSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export { ENVIRONMENTAL_IMAGES, FALLBACK_SVGS } from '../../config/environmentalImagesConfig';
