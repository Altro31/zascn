"use client";
import { cn } from "@/lib/utils";

export type DebtTypeFilterValue = "inter" | "internal" | undefined;

interface DebtTypeTabsFilterProps {
  value?: DebtTypeFilterValue;
  onChange: (val: DebtTypeFilterValue) => void;
  className?: string;
}

// Colores asociados
const COLORS: Record<string, string> = {
  inter: "bg-indigo-100 text-indigo-700 border-indigo-200",
  internal: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const LABELS: Record<Exclude<DebtTypeFilterValue, undefined>, string> = {
  inter: "Deudas Inter-negocios",
  internal: "Transferencias Internas",
};

export function DebtTypeTabsFilter({
  value,
  onChange,
  className,
}: DebtTypeTabsFilterProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-slate-200 overflow-hidden",
        className
      )}
    >
      {(
        Object.keys(LABELS) as Array<Exclude<DebtTypeFilterValue, undefined>>
      ).map((k) => {
        const active = value === k;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(active ? undefined : k)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium border-r last:border-r-0 transition-colors",
              active
                ? COLORS[k]
                : "bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300",
              !active && "border-slate-200"
            )}
          >
            {LABELS[k]}
          </button>
        );
      })}
    </div>
  );
}

export function debtTypeColor(value?: DebtTypeFilterValue) {
  if (!value) return undefined;
  return COLORS[value];
}
