"use client";

export type GradientProgressProps = {
  value?: number; // 0-100
  height?: number;
  className?: string;
  showLabel?: boolean;
};

// Simple gradient progress bar with tone changes as it fills
export function GradientProgress({
  value = 0,
  height = 8,
  className = "",
  showLabel = false,
}: GradientProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  const colorClass =
    v < 33 ? "bg-rose-500" : v < 66 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div
      className={`w-full rounded-full bg-slate-200/70 dark:bg-slate-700/50 ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
    >
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-300`}
        style={{ width: `${v}%` }}
      />
      {showLabel && (
        <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          {v}%
        </div>
      )}
    </div>
  );
}

export default GradientProgress;
