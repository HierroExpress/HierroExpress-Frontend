"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

export const ImageCarousel = () => {
  return (
    <div className="w-full h-auto bg-secondary-200">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}>
        <SwiperSlide>
          <img src="carousel/brocha.png" alt="Imagen 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="carousel/cerradura.png" alt="Imagen 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="carousel/cerrojosss.png" alt="Imagen 3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="carousel/rodillo2.png" alt="Imagen 3" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
