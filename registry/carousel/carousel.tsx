"use client";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Slide = {
  image: string;
  alt?: string;
  title?: string;
  description?: string;
};

type CustomSwiperProps = {
  slides: Slide[];
  id?: string;
  rtl?: boolean;
};

export function Carousel({
  slides,
  id = "custom-swiper",
  rtl = false,
}: CustomSwiperProps) {
  const nextClass = `${id}-next`;
  const prevClass = `${id}-prev`;

  return (
    <div className="relative max-w-3xl mx-auto mb-5">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={30}
        loop
        pagination={{ clickable: true, type: "fraction" }}
        navigation={{
          nextEl: `.${nextClass}`,
          prevEl: `.${prevClass}`,
        }}
        dir={rtl ? "rtl" : "ltr"}
        key={rtl ? "rtl" : "ltr"}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide.image}
              alt={slide.alt || slide.title || `Slide ${index + 1}`}
              className="w-full"
            />
            {(slide.title || slide.description) && (
              <div className="absolute z-[999] text-white bottom-8 left-1/2 w-full -translate-x-1/2 text-center sm:px-0 px-11">
                {slide.title && (
                  <div className="text-3xl font-bold">{slide.title}</div>
                )}
                {slide.description && (
                  <div className="mb-4 sm:text-base font-medium">
                    {slide.description}
                  </div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className={cn(
          prevClass,
          "swiper-button grid place-content-center ltr:left-2 rtl:right-2 p-1 transition text-primary hover:text-white border border-primary hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2"
        )}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <button
        className={cn(
          nextClass,
          "swiper-button grid place-content-center ltr:right-2 rtl:left-2 p-1 transition text-primary hover:text-white border border-primary hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2"
        )}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
}
