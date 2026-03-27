import { Plus } from "lucide-react";
import { DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { ColumnSelector } from "./column-selector";
import { DataGridFilterTab, DataGridFilterTabsOptions } from "./types";

interface DataGridHeaderProps<T> {
  enableSearch: boolean;
  enableColumnToggle: boolean;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  createLoading?: boolean;
  createText?: string;
  columns: DataTableColumn<T>[];
  hiddenColumns: string[];
  onToggleColumn: (columnAccessor: string) => void;
  showColumnSelector: boolean;
  onToggleColumnSelector: () => void;
  // Nuevas props para componentes adicionales
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  customActions?: React.ReactNode;
  // Tabs de filtro
  filterTabs?: DataGridFilterTab[];
  filterTabsOptions?: DataGridFilterTabsOptions;
  defaultActiveFilterKey?: string;
  activeFilterKey?: string;
  onFilterTabChange?: (key: string) => void;
  // Selección y acciones en bloque
  selectedCount?: number;
  selectAllLabel?: string;
  onSelectAllVisible?: () => void;
  bulkActionLabel?: string;
  bulkActionClassName?: string;
  onBulkAction?: () => void;
  bulkActionDisabled?: boolean;
  bulkActionLoading?: boolean;
}

export function DataGridHeader<T extends Record<string, any>>({
  enableSearch,
  enableColumnToggle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onCreate,
  createLoading,
  createText,
  columns,
  hiddenColumns,
  onToggleColumn,
  showColumnSelector,
  onToggleColumnSelector,
  leftActions,
  rightActions,
  customActions,
  filterTabs,
  filterTabsOptions,
  defaultActiveFilterKey,
  activeFilterKey,
  onFilterTabChange,
  selectedCount,
  selectAllLabel,
  onSelectAllVisible,
  bulkActionLabel,
  bulkActionClassName,
  onBulkAction,
  bulkActionDisabled,
  bulkActionLoading,
}: DataGridHeaderProps<T>) {
  const [internalActiveKey, setInternalActiveKey] = useState<
    string | undefined
  >(activeFilterKey ?? defaultActiveFilterKey ?? filterTabs?.[0]?.key);

  useEffect(() => {
    if (activeFilterKey !== undefined) setInternalActiveKey(activeFilterKey);
  }, [activeFilterKey]);

  const {
    variant,
    size,
    className: tabsClassName,
  } = useMemo(
    () => ({
      variant: filterTabsOptions?.variant ?? "underline",
      size: filterTabsOptions?.size ?? "md",
      className: filterTabsOptions?.className ?? "",
    }),
    [filterTabsOptions]
  );

  const sizeClasses = useMemo(() => {
    switch (size) {
      case "sm":
        return "text-xs px-2.5 py-1.5";
      case "lg":
        return "text-sm px-4 py-2.5";
      default:
        return "text-sm px-3.5 py-2";
    }
  }, [size]);

  const renderTabButton = (tab: DataGridFilterTab) => {
    const isActive = tab.key === internalActiveKey;
    const common =
      "relative inline-flex items-center gap-2 rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed";

    const classesByVariant: Record<string, string> = {
      underline:
        `${common} ${sizeClasses} bg-transparent hover:bg-muted/40 dark:hover:bg-muted/20 text-foreground/80 hover:text-foreground` +
        (isActive ? " text-foreground" : ""),
      pill: `${common} ${sizeClasses} border border-muted/60 dark:border-muted/40 hover:border-muted text-foreground/80 hover:text-foreground " +
        (isActive ? " bg-primary/10 text-primary border-primary/30" : " bg-transparent")`,
      soft: `${common} ${sizeClasses} bg-muted/40 hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/30 text-foreground/80 hover:text-foreground " +
        (isActive ? " ring-1 ring-primary/30" : "")`,
    };

    const classes = classesByVariant[variant] ?? classesByVariant.underline;

    return (
      <button
        key={tab.key}
        type="button"
        disabled={tab.disabled}
        className={classes + " " + (tab.className ?? "")}
        onClick={() => {
          setInternalActiveKey(tab.key);
          onFilterTabChange?.(tab.key);
          tab.onClick?.();
        }}
      >
        {tab.icon}
        <span className="truncate">{tab.title}</span>
        {tab.count !== undefined && (
          <span className="bg-muted text-foreground/70 dark:bg-muted/40 ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-medium">
            {tab.count}
          </span>
        )}
        {variant === "underline" && (
          <span
            className={
              "bg-primary absolute -bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full transition-all duration-200 " +
              (isActive ? "w-8" : "w-0")
            }
          />
        )}
      </button>
    );
  };

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="grid gap-2 md:grid-cols-[auto_1fr_auto] md:items-center">
        {/* Left (filters / tabs) */}
        {leftActions && (
          <div className="flex items-end justify-center md:justify-start">
            {leftActions}
          </div>
        )}
        {/* Center search */}
        {enableSearch ? (
          <div className="flex  items-end justify-center ">
            <input
              type="text"
              className="form-input focus:border-primary focus:ring-primary/20 w-full shadow-sm focus:ring-2"
              placeholder={searchPlaceholder || "Buscar"}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        ) : (
          <div />
        )}
        {/* Right actions */}
        <div className="flex flex-wrap items-end justify-end gap-2">
          {filterTabs && filterTabs.length > 0 && (
            <div
              className={
                "h-14 w-full overflow-x-auto overflow-y-hidden md:w-auto " +
                (tabsClassName ?? "")
              }
            >
              <div className="flex items-center gap-1.5 md:mr-2">
                {filterTabs.map((tab) => renderTabButton(tab))}
              </div>
            </div>
          )}
          {rightActions}
          {enableColumnToggle && (
            <ColumnSelector
              columns={columns}
              hiddenColumns={hiddenColumns}
              onToggleColumn={onToggleColumn}
              isOpen={showColumnSelector}
              onToggle={onToggleColumnSelector}
            />
          )}
          {onCreate && (
            <button
              type="button"
              className="btn btn-primary flex gap-2 text-white dark:text-white"
              onClick={onCreate}
            >
              {createLoading ? (
                <span className="animate-pulse">Creando ...</span>
              ) : (
                <>
                  <Plus className="hidden h-5 w-5 md:block" />
                  {createText || "Crear"}
                </>
              )}
            </button>
          )}
          {customActions}
        </div>
      </div>
      {!!selectedCount && selectedCount > 0 && (
        <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={onSelectAllVisible}
          >
            {selectAllLabel || "Seleccionar todos"}
          </button>
          <button
            type="button"
            className={"btn " + (bulkActionClassName || "btn-danger")}
            onClick={onBulkAction}
            disabled={!!bulkActionDisabled || !!bulkActionLoading}
          >
            {bulkActionLoading ? "Procesando…" : bulkActionLabel || "Acción"}
          </button>
        </div>
      )}
    </div>
  );
}
