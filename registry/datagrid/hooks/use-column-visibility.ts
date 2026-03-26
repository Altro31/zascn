import { useCallback, useState } from "react";

export function useColumnVisibility() {
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  const toggleColumnVisibility = useCallback((columnAccessor: string) => {
    setHiddenColumns(prev => {
      const isHidden = prev.includes(columnAccessor);
      if (isHidden) {
        return prev.filter(col => col !== columnAccessor);
      } else {
        return [...prev, columnAccessor];
      }
    });
  }, []);

  const isColumnVisible = useCallback((columnAccessor: string) => {
    return !hiddenColumns.includes(columnAccessor);
  }, [hiddenColumns]);

  return {
    hiddenColumns,
    toggleColumnVisibility,
    isColumnVisible,
  };
}
