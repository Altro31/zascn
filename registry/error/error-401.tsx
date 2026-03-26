"use client";

import { cn } from "@/lib/utils";
import lottie from "lottie-web";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { redirectToLogin } from "zas-sso-client";
import animationData from "@/registry/error/animations/401.json";

/**
 * Error401Fallback
 * Fallback especializado para errores 401 (sesión expirada / no autorizada).
 * Mantiene la misma interfaz (props) que el ErrorBoundary default (error, reset)
 * para ser un drop-in replacement cuando detectes un 401.
 */
export function Error401Fallback({
  error,
}: {
  error?: Error & { digest?: string; status?: number };
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const goBack = () => router.back();

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

  useEffect(() => {
    setIsRedirecting(true);
    redirectToLogin();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-linear-to-r from-slate-50 to-slate-200 px-6 py-10 transition-colors md:flex-row dark:from-slate-950 dark:to-slate-800">
      {/* Animación */}
      <div className="flex w-full max-w-xs flex-1 items-center justify-center md:max-w-sm">
        <div
          ref={containerRef}
          className="aspect-square w-full max-w-[300px]"
        />
      </div>

      {/* Contenido */}
      <div className="flex max-w-xl flex-1 flex-col rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur transition-colors md:p-10 dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-800 md:text-[1.65rem] dark:text-slate-100">
          Sesión expirada
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-slate-600 md:text-base dark:text-slate-300">
          Tu sesión ya no es válida o no tienes autorización para acceder a este
          recurso. Inicia sesión nuevamente para continuar. Si el problema
          persiste, contacta a un administrador.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="group relative overflow-hidden rounded-lg bg-linear-to-r from-blue-500 to-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
            onClick={() => redirectToLogin()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full" />
            <span className="relative flex items-center justify-center">
              <RefreshCw
                className={cn(
                  "mr-2 h-5 w-5 transition-transform duration-300",
                  isHovering && "translate-x-1"
                )}
              />
              {isRedirecting ? "Redirigiendo…" : "Iniciar sesión"}
            </span>
          </button>
          <button
            onClick={goBack}
            className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Volver
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

export default Error401Fallback;
