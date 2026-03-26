"use client";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import BreadcrumbLinks, { type BreadcrumbItem } from "./breadcrumbs";

// Mapa de etiquetas legibles para segmentos de ruta.
const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Usuarios",
  roles: "Roles",
  permissions: "Permisos",
  subsystems: "Subsistemas",
  businesses: "Negocios",
  documents: "Documentos",
  edit: "Editar",
  create: "Crear",
  new: "Nuevo",
};

function isDynamicValue(segment: string) {
  if (!segment) return false;
  if (/^\d+$/.test(segment)) return true; // solo números
  if (/^[0-9a-fA-F-]{8,}$/.test(segment) && segment.includes("-")) return true; // uuid
  if (/^[0-9a-zA-Z]{10,}$/.test(segment)) return true; // hash/alfanum largo
  return false;
}

function segmentToLabel(segment: string): string {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  if (isDynamicValue(segment)) return segment;
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

interface BreadcrumbsContextValue {
  items: BreadcrumbItem[];
  setSegmentOverride: (segment: string, label: string) => void;
  removeSegmentOverride: (segment: string) => void;
  setSegmentOverrides: (map: Record<string, string>) => void;
  resetSegmentOverrides: () => void;
  setFinalLabel: (label: string | null) => void;
  setSegmentLabelResolver: (fn: BreadcrumbsLabelResolver | null) => void;
}

type BreadcrumbsLabelResolver = (args: {
  segment: string;
  index: number;
  segments: string[];
  isLast: boolean;
}) => string | undefined | null;

const BreadcrumbsContext = createContext<BreadcrumbsContextValue | undefined>(
  undefined
);

interface ProviderProps {
  children: React.ReactNode;
  showOnRoot?: boolean;
}

export const BreadcrumbsProvider: React.FC<ProviderProps> = ({
  children,
  showOnRoot = false,
}) => {
  const pathname = usePathname();
  const [segmentOverrides, setSegmentOverridesState] = useState<
    Record<string, string>
  >({});
  const [finalLabel, setFinalLabelState] = useState<string | null>(null);
  const [segmentLabelResolver, setSegmentLabelResolverState] =
    useState<BreadcrumbsLabelResolver | null>(null);

  const setSegmentOverride = useCallback((segment: string, label: string) => {
    setSegmentOverridesState((prev) => ({ ...prev, [segment]: label }));
  }, []);

  const removeSegmentOverride = useCallback((segment: string) => {
    setSegmentOverridesState((prev) => {
      const n = { ...prev };
      delete n[segment];
      return n;
    });
  }, []);

  const setSegmentOverrides = useCallback((map: Record<string, string>) => {
    setSegmentOverridesState((prev) => ({ ...prev, ...map }));
  }, []);

  const resetSegmentOverrides = useCallback(() => {
    setSegmentOverridesState({});
  }, []);

  const setFinalLabel = useCallback((label: string | null) => {
    setFinalLabelState(label);
  }, []);

  const setSegmentLabelResolver = useCallback(
    (fn: BreadcrumbsLabelResolver | null) => {
      setSegmentLabelResolverState(() => fn);
    },
    []
  );

  const items = useMemo(() => {
    if (!pathname) return [];
    const segments = pathname.split("/").filter(Boolean);
    const dashboardIndex = segments.indexOf("dashboard");
    if (dashboardIndex === -1) return [];
    const relevant = segments.slice(dashboardIndex);
    if (relevant.length === 1 && !showOnRoot) return [];

    const acc: BreadcrumbItem[] = [];
    let cumulative = "";

    relevant.forEach((seg, idx) => {
      cumulative += `/${seg}`;
      const isLast = idx === relevant.length - 1;

      let label: string | null | undefined = segmentOverrides[seg];
      if (label == null && segmentLabelResolver) {
        label = segmentLabelResolver({
          segment: seg,
          index: idx,
          segments: relevant,
          isLast,
        });
      }
      if (label == null) label = segmentToLabel(seg);
      if (isLast && finalLabel) label = finalLabel;
      const dynamic = isDynamicValue(seg);
      const href = !isLast && !dynamic ? cumulative : undefined;
      acc.push({ label: String(label), linkTo: href });
    });
    return acc;
  }, [
    pathname,
    showOnRoot,
    segmentOverrides,
    segmentLabelResolver,
    finalLabel,
  ]);

  const value: BreadcrumbsContextValue = {
    items,
    setSegmentOverride,
    removeSegmentOverride,
    setSegmentOverrides,
    resetSegmentOverrides,
    setFinalLabel,
    setSegmentLabelResolver,
  };

  return (
    <BreadcrumbsContext.Provider value={value}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbsContext);
  if (!ctx)
    throw new Error("useBreadcrumbs must be used within BreadcrumbsProvider");
  return ctx;
}

// Componente que renderiza los breadcrumbs actuales
export const Breadcrumbs: React.FC = () => {
  const { items } = useBreadcrumbs();
  if (!items.length) return null;
  return <BreadcrumbLinks items={items} />;
};
