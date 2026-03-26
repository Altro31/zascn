"use client"; // Error boundaries must be Client Components

import lottie from "lottie-web";
import { useEffect, useRef } from "react";
import animationData from "@/registry/error/animations/General.json";

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Log for observability
    console.error(error);
  }, [error]);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
    });
    return () => anim.destroy();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-linear-to-r from-slate-50 to-slate-200 px-6 py-10 transition-colors md:flex-row dark:from-slate-950 dark:to-slate-800">
      <div className="flex w-full max-w-md flex-1 items-center justify-center">
        <div ref={containerRef} className="aspect-square w-full max-w-85" />
      </div>
      <div className="flex max-w-xl flex-1 flex-col rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur transition-colors md:p-10 dark:border-slate-700 dark:bg-slate-900/70">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[12px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          Aviso
        </span>
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-800 md:text-[1.75rem] dark:text-slate-100">
          ¡Ups! Algo salió mal
        </h2>
        <p className="mb-7 text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">
          Ocurrió un error inesperado. Puedes intentar nuevamente y, si el
          problema persiste, contáctanos para ayudarte.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-lg active:translate-y-px"
          >
            Reintentar
          </button>
          <button
            onClick={() => (window?.location ? window.location.reload() : null)}
            className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Recargar página
          </button>
        </div>
        {error?.digest && (
          <small className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Código de referencia: {error.digest}
          </small>
        )}
      </div>
    </div>
  );
}
