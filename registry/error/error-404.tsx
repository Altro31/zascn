"use client";

import lottie from "lottie-web";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import animationData from "@/components/error/animations/404.json";

/**
 * Error404Fallback
 * Pantalla especializada para status 404 (not found / no encontrado).
 * Mensaje: página no encontrada. Botón: Ir a página de inicio.
 */
export function Error404Fallback({
  error,
}: {
  error?: Error & { digest?: string; status?: number };
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const goHome = () => router.push("/");

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
      <div className="flex w-full max-w-xs flex-1 items-center justify-center md:max-w-sm">
        <div
          ref={containerRef}
          className="aspect-square w-full max-w-[300px]"
        />
      </div>
      <div className="flex max-w-xl flex-1 flex-col rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur transition-colors md:p-10 dark:border-slate-700 dark:bg-slate-900/70">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold tracking-wide text-rose-700 uppercase dark:bg-rose-900/40 dark:text-rose-300">
          No encontrado (404)
        </span>
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-800 md:text-[1.65rem] dark:text-slate-100">
          Página no encontrada
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">
          La página que intentas acceder no existe o fue movida. Verifica la URL
          o vuelve a la página de inicio.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={goHome}
            className="rounded-lg bg-linear-to-r from-rose-600 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-rose-500 hover:to-rose-400 hover:shadow-lg"
          >
            Ir a página de inicio
          </button>
        </div>
        {error?.digest && (
          <small className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Ref: {error.digest}
          </small>
        )}
      </div>
    </div>
  );
}

export default Error404Fallback;
