"use client";

interface DateRangeFilterProps {
  from?: Date | null;
  to?: Date | null;
  onChange: (range: { from?: Date | null; to?: Date | null }) => void;
  size?: "small" | "default";
}

const toInputValue = (d?: Date | null) =>
  d ? d.toISOString().split("T")[0] : "";
const fromInputValue = toInputValue;

export function DateRangeFilter({
  from,
  to,
  onChange,
  size = "small",
}: DateRangeFilterProps) {
  const base =
    "form-input w-full border rounded-md bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/30 outline-none";
  const sz = size === "small" ? "h-9 text-xs px-2" : "h-10 text-sm px-3";
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col">
        <span className="block text-[11px] font-semibold text-slate-600 mb-2 tracking-wide uppercase">
          Desde
        </span>
        <input
          type="date"
          className={`${base} ${sz}`}
          value={fromInputValue(from)}
          onChange={(e) =>
            onChange({
              from: e.target.value ? new Date(e.target.value) : null,
              to,
            })
          }
        />
      </div>
      <div className="flex flex-col">
        <span className="block text-[11px] font-semibold text-slate-600 mb-2 tracking-wide uppercase">
          Hasta
        </span>
        <input
          type="date"
          className={`${base} ${sz}`}
          value={toInputValue(to)}
          onChange={(e) =>
            onChange({
              to: e.target.value ? new Date(e.target.value) : null,
              from,
            })
          }
        />
      </div>
    </div>
  );
}

export default DateRangeFilter;
