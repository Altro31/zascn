"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "./zas-loader.json";

export default function ZasLoader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => instance.destroy(); // Limpieza
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black backdrop-blur-sm">
      <div
        ref={containerRef}
        className="w-72 h-72" // Tamaño del logo
      />
    </div>
  );
}
