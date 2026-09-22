import { useEffect, useState } from "react";
import styles from "./common_css/common.module.css";
export const BannerComponent = ({ css, image, imagecss, alt }) => {
  return (
    <div className={css}>
      {image && <img src={image} style={{maxHeight:"600px"}} className={imagecss} alt={alt || ""} />}
    </div>
  );
};

export const UserBannerTopComponent = ({ image, imagecss, alt, divCSS }) => {
  return (
    <div className={`${divCSS } w-full`}>
      {image && <img src={image} className={imagecss} alt={alt || ""} />}
    </div>
  );
};

export const UserBannerMultipleImages = ({
  images = [],
  alt = "",
  interval = 3000,
  divCss = "",
  imageCss = "",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const switchImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const imageInterval = setInterval(switchImage, interval);

    return () => clearInterval(imageInterval);
  }, [images.length, interval]);

  return (
    <div className={divCss || styles.userBannerTop}>
      {images.length > 0 && (
        <img
          src={images[currentImageIndex]}
          className={imageCss || styles.userBannerTopImage}
          alt={alt || `Image ${currentImageIndex + 1}`}
        />
      )}
    </div>
  );
};


export const TopMainBannerPages = ({ image, imagecss, alt }) => {
  return (
    <div className={`${styles.TopMainBannerPages}`}>
      {image && <img src={image} className={imagecss} alt={alt || ""} />}
    </div>
  );
};
