import { X } from "lucide-react";
import React from "react";

export interface ChipItem {
  key: string;
  label: React.ReactNode;
  color?:
    | "indigo"
    | "violet"
    | "emerald"
    | "slate"
    | "amber"
    | "blue"
    | "orange"
    | "rose";
  className?: string; // optional classes to fully control bg/text/border
  onClear: () => void;
}

const colorMap: Record<NonNullable<ChipItem["color"]>, string> = {
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  slate: "bg-slate-200/70 text-slate-700 border-slate-300",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
};

export function ActiveFilterChips({ items }: { items: ChipItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it.key}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${
            it.className ? it.className : colorMap[it.color || "slate"]
          }`}
        >
          {it.label}
          <button
            type="button"
            className="ml-1 hover:opacity-80"
            onClick={it.onClear}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

export default ActiveFilterChips;
