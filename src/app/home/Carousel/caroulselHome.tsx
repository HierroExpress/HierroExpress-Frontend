"use client";

export const ImageBanner = () => {
  return (
    <div className="w-full h-64 lg:h-96 relative bg-secondary-200 overflow-hidden">
      <img
        src="/carousel/banner.png"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
