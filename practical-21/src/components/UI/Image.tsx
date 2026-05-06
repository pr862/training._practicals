import React from "react";
import { getImageUrl } from "../../utils/imageHelper";

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackColor?: string;
  fallbackText?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = "",
  className = "",
  fallbackColor = "#1db9a4",
  fallbackText = "Image",
  onError,
  onLoad,
  width,
  height,
  style,
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string>("");

  React.useEffect(() => {
    setImageSrc(getImageUrl(src));
    setHasError(false);
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  if (hasError || !imageSrc) {
    const text = fallbackText || alt || "Image";
    const encodedText = encodeURIComponent(text.charAt(0).toUpperCase());
    const fallbackUrl = `https://via.placeholder.com/${width || "300"}x${height || "300"}/${fallbackColor.replace("#", "")}/ffffff?text=${encodedText}`;
    
    return (
      <img
        src={fallbackUrl}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={style}
        onError={onError}
        onLoad={onLoad}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={style}
      onError={handleImageError}
      onLoad={handleImageLoad}
    />
  );
};

export default Image;