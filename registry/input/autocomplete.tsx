import { cn } from "@/lib/utils";
import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// --------- Types ---------
// Base item interface (option)
export interface BaseAutocompleteOption {
  label: string;
  value: string;
  disabled?: boolean;
  // metadata libre
  [key: string]: any;
}

// Group header item (no selectable)
export interface AutocompleteGroupHeader {
  type: "group";
  id: string;
  label: string;
  sticky?: boolean;
}

export type AutocompleteItem = BaseAutocompleteOption | AutocompleteGroupHeader;

function isGroup(item: AutocompleteItem): item is AutocompleteGroupHeader {
  return (item as any)?.type === "group";
}

export interface AutocompleteLogicProps<
  P extends object = Record<string, any>,
> {
  fetchItems: (
    query: string,
    params?: P & { page?: number; signal?: AbortSignal }
  ) => Promise<BaseAutocompleteOption[]>; // fetch solo devuelve opciones; agrupación ocurre después
  debounceMs?: number;
  initialValue?: string;
  onSelect?: (item: BaseAutocompleteOption) => void;
  params?: P;
  onScrollEnd?: () => void; // scroll infinito -> dispara loadMore
  // Nuevos comportamientos
  minChars?: number; // mínimo para disparar fetch
  allowFreeText?: boolean;
  allowEmptyFetch?: boolean; // fetch con query vacío
  itemsStrategy?: "replace" | "append"; // cómo incorporar resultados
  enableLocalFilter?: boolean; // filtrar client-side post fetch
  groupBy?: (item: BaseAutocompleteOption) => string | undefined; // agrupar
  freeTextNormalizer?: (text: string) => BaseAutocompleteOption; // crear opción desde texto libre
  localFilterFn?: (item: BaseAutocompleteOption, query: string) => boolean; // custom filter
  pageSize?: number; // para manejo de paginado simple
  onError?: (err: unknown) => void;
  loadingText?: string;
  emptyText?: string;
  typeToSearchText?: string;
  classes?: Partial<{
    root: string;
    inputWrapper: string;
    input: string;
    clearButton: string;
    list: string;
    option: string;
    optionActive: string;
    optionDisabled: string;
    groupHeader: string;
    loading: string;
    empty: string;
    error: string;
    typeToSearch: string;
  }>;
}

export type AutocompleteContextType = ReturnType<typeof useAutocompleteLogic>;

type RenderInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  ref: RefObject<HTMLInputElement>;
  role: string;
  "aria-autocomplete": string;
  "aria-controls": string;
  "aria-expanded": boolean;
  "aria-activedescendant"?: string;
  clearButton?: ReactNode;
  [key: string]: any;
};

type RenderOptionsProps = {
  items: AutocompleteItem[];
  loading: boolean;
  showDropdown: boolean;
  activeIndex: number;
  handleSelect: (item: BaseAutocompleteOption) => void;
  setActiveIndex: (idx: number) => void;
  onScroll: (e: React.UIEvent<HTMLUListElement>) => void;
  error?: string | null;
};

type RenderOptionProps = {
  item: BaseAutocompleteOption;
  index: number;
  active: boolean;
  [key: string]: any;
};

// --------- Context API ---------
const AutocompleteContext = createContext<AutocompleteContextType | null>(null);

/**
 * Hook para obtener el contexto del Autocomplete.
 */
function useAutocompleteContext(): AutocompleteContextType {
  const ctx = useContext(AutocompleteContext);
  if (!ctx) {
    throw new Error(
      "Autocomplete subcomponents must be inside <Autocomplete>."
    );
  }
  return ctx;
}

// --------- Custom Hook: Manejo de lógica principal ---------
/**
 * Hook que maneja el estado y lógica del autocomplete (fetch, selección, scroll).
 */
function useAutocompleteLogic<P extends object = Record<string, any>>({
  fetchItems,
  debounceMs = 300,
  initialValue = "",
  onSelect,
  params,
  onScrollEnd,
  minChars = 1,
  allowFreeText = false,
  allowEmptyFetch = false,
  itemsStrategy = "replace",
  enableLocalFilter = false,
  groupBy,
  freeTextNormalizer = (text) => ({ label: text, value: text }),
  localFilterFn = (item, q) =>
    item.label.toLowerCase().includes(q.toLowerCase()) ||
    item.value.toLowerCase().includes(q.toLowerCase()),
  pageSize = 50,
  onError,
  loadingText = "Cargando...",
  emptyText = "Sin resultados",
  typeToSearchText = "Escribe para buscar...",
  classes,
}: AutocompleteLogicProps<P>) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [items, setItems] = useState<BaseAutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const classesRef = useRef<typeof classes | undefined>(undefined);
  if (!classesRef.current) classesRef.current = classes;

  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const scrollEndRef = useRef(false);

  // Reseteo cuando cambia query
  useEffect(() => {
    setPage(1);
  }, [inputValue]);

  const effectiveParams = useMemo(
    () => ({ ...(params as any), page, pageSize }),
    [params, page, pageSize]
  );

  const shouldFetch =
    (allowEmptyFetch && inputValue === "") || inputValue.length >= minChars;

  useEffect(() => {
    if (!shouldFetch) {
      setItems([]);
      setShowDropdown(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    setError(null);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      const reqId = ++requestIdRef.current;
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      try {
        const fetched = await fetchItems(inputValue, {
          ...(effectiveParams as any),
          signal: abortRef.current.signal,
        });
        if (reqId !== requestIdRef.current) return; // obsoleto
        const filtered = enableLocalFilter
          ? fetched.filter((f) => localFilterFn(f, inputValue))
          : fetched;
        setItems((prev) =>
          itemsStrategy === "append" && page > 1
            ? [...prev, ...filtered]
            : filtered
        );
        setShowDropdown(true);
        setActiveIndex(filtered.length ? 0 : -1);
        scrollEndRef.current = false;
        setHasMore(filtered.length >= pageSize);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error("Autocomplete fetch error", e);
        setError(e?.message || "Error al cargar");
        onError?.(e);
      } finally {
        if (reqId === requestIdRef.current) setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [
    inputValue,
    effectiveParams,
    shouldFetch,
    debounceMs,
    enableLocalFilter,
    localFilterFn,
    itemsStrategy,
    page,
    pageSize,
    fetchItems,
    onError,
  ]);

  function handleSelect(item: BaseAutocompleteOption) {
    setInputValue(item.label || item.value || "");
    setShowDropdown(false);
    setActiveIndex(-1);
    onSelect?.(item);
  }

  function clearInput() {
    setInputValue("");
    setItems([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    setPage(1);
  }

  function resetDropdown() {
    setShowDropdown(false);
    setActiveIndex(-1);
  }

  function handleOptionsScroll(e: React.UIEvent<HTMLUListElement>) {
    const target = e.target as HTMLUListElement;
    if (
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10 &&
      !loading &&
      !scrollEndRef.current &&
      hasMore
    ) {
      scrollEndRef.current = true;
      if (onScrollEnd) onScrollEnd();
      setPage((p) => p + 1);
    }
  }

  // Agrupación (post fetch) -> transforma en items con headers si groupBy existe
  const groupedItems: AutocompleteItem[] = useMemo(() => {
    if (!groupBy) return items;
    const groups: Record<string, BaseAutocompleteOption[]> = {};
    items.forEach((it) => {
      const g = groupBy(it);
      if (!g) return;
      if (!groups[g]) groups[g] = [];
      groups[g].push(it);
    });
    const sequence: AutocompleteItem[] = [];
    Object.entries(groups).forEach(([g, opts]) => {
      sequence.push({ type: "group", id: g, label: g });
      sequence.push(...opts);
    });
    return sequence;
  }, [items, groupBy]);

  return {
    inputValue,
    setInputValue,
    items: groupedItems,
    rawItems: items,
    loading,
    showDropdown,
    setShowDropdown,
    handleSelect,
    activeIndex,
    setActiveIndex,
    resetDropdown,
    clearInput,
    handleOptionsScroll,
    error,
    allowFreeText,
    freeTextNormalizer,
    loadingText,
    emptyText,
    typeToSearchText,
    isGroup,
    classes: classesRef.current || {},
  };
}

// --------- Main Wrapper (Provider) ---------
/**
 * Componente principal, provee el contexto y orquesta los subcomponentes.
 */
export function Autocomplete<P extends object = Record<string, any>>(
  props: AutocompleteLogicProps<P> & { children: ReactNode }
) {
  const logic = useAutocompleteLogic<P>(props);
  const contextValue = useMemo(() => logic, [logic]);
  return (
    <AutocompleteContext.Provider value={contextValue}>
      <div className={cn("relative w-full", (props as any).classes?.root)}>
        {props.children}
      </div>
    </AutocompleteContext.Provider>
  );
}

// --------- Input Component ---------
/**
 * Input de Autocomplete con soporte para render prop, navegación de teclado y clear button.
 */
export function AutocompleteInput({
  render,
  clearButton,
  ...props
}: {
  render?: (inputProps: RenderInputProps) => ReactNode;
  clearButton?: ReactNode;
} & HTMLAttributes<HTMLInputElement>) {
  const {
    inputValue,
    setInputValue,
    showDropdown,
    setShowDropdown,
    resetDropdown,
    items,
    activeIndex,
    setActiveIndex,
    handleSelect,
    clearInput,
    classes,
  } = useAutocompleteContext();

  const inputRef = useRef<HTMLInputElement>(null);

  // Maneja navegación de teclado (incluye grupos, Home/End)
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || items.length === 0) return;

      const move = (direction: 1 | -1) => {
        if (!items.length) return;
        let idx = activeIndex;
        let safety = 0;
        do {
          idx = (idx + direction + items.length) % items.length;
          safety++;
        } while (
          items[idx] &&
          (isGroup(items[idx] as any) || (items[idx] as any).disabled) &&
          safety < items.length
        );
        setActiveIndex(idx);
      };

      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        for (let i = 0; i < items.length; i++) {
          if (!isGroup(items[i] as any) && !(items[i] as any).disabled) {
            setActiveIndex(i);
            break;
          }
        }
      } else if (e.key === "End") {
        e.preventDefault();
        for (let i = items.length - 1; i >= 0; i--) {
          if (!isGroup(items[i] as any) && !(items[i] as any).disabled) {
            setActiveIndex(i);
            break;
          }
        }
      } else if (e.key === "Enter") {
        if (
          activeIndex >= 0 &&
          activeIndex < items.length &&
          !isGroup(items[activeIndex] as any) &&
          !(items[activeIndex] as any).disabled
        ) {
          handleSelect(items[activeIndex] as any);
        }
      } else if (e.key === "Escape") {
        resetDropdown();
      }
    },
    [
      showDropdown,
      items,
      activeIndex,
      handleSelect,
      resetDropdown,
      setActiveIndex,
    ]
  );

  // Render prop para máxima personalización
  if (render) {
    return render({
      value: inputValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setShowDropdown(true);
      },
      // Cast to any to satisfy generic consumer signature expecting () => void in render props
      onFocus: (() => setShowDropdown(true)) as any,
      onBlur: (() => {
        setTimeout(resetDropdown, 150);
      }) as any,
      onKeyDown,
      ref: inputRef,
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-controls": "autocomplete-list",
      "aria-expanded": Boolean(showDropdown) as boolean,
      "aria-activedescendant":
        activeIndex >= 0 ? `autocomplete-item-${activeIndex}` : undefined,
      clearButton: (
        <button
          type="button"
          aria-label="Limpiar"
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          style={{ display: inputValue ? "block" : "none" }}
          onClick={clearInput}
        >
          &#10006;
        </button>
      ),
      ...props,
    } as any);
  }

  // Input por defecto
  return (
    <div className={cn("relative w-full", classes?.inputWrapper)}>
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(resetDropdown, 150)} // delay para click en opción
        onKeyDown={onKeyDown}
        ref={inputRef}
        role="combobox"
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        aria-expanded={showDropdown}
        aria-activedescendant={
          activeIndex >= 0 ? `autocomplete-item-${activeIndex}` : undefined
        }
        className={cn("border px-3 py-2 rounded w-full", classes?.input)}
        {...props}
      />
      {inputValue && (
        <button
          type="button"
          aria-label="Limpiar"
          className={cn(
            "absolute right-2 top-2 text-gray-400 hover:text-gray-600",
            classes?.clearButton
          )}
          onClick={clearInput}
        >
          &#10006;
        </button>
      )}
      {clearButton /* opcional, para custom render */}
    </div>
  );
}

// --------- Options Dropdown ---------
/**
 * Renderiza las opciones del autocomplete con animaciones, render prop y scroll end.
 */
export function AutocompleteOptions({
  render,
  className = "",
  animation = "fade-slide",
  ...props
}: {
  render?: (optionsProps: RenderOptionsProps) => ReactNode;
  className?: string;
  animation?: "fade-slide" | "none";
} & HTMLAttributes<HTMLUListElement>) {
  const {
    items,
    isGroup,
    loading,
    showDropdown,
    activeIndex,
    handleSelect,
    setActiveIndex,
    handleOptionsScroll,
    error,
    emptyText,
    loadingText,
    typeToSearchText,
    inputValue,
    classes,
  } = useAutocompleteContext();

  // Animaciones (fade + slide, por defecto)
  const baseAnimation =
    animation === "fade-slide"
      ? "transition-all duration-200 ease-out opacity-0 translate-y-2"
      : "";

  // Render prop para opciones
  if (render) {
    return render({
      items,
      loading,
      showDropdown,
      activeIndex,
      handleSelect,
      setActiveIndex,
      onScroll: handleOptionsScroll,
    });
  }

  // Dropdown por defecto
  return (
    <>
      {showDropdown && (
        <ul
          id="autocomplete-list"
          role="listbox"
          className={cn(
            "absolute left-0 right-0 mt-1 bg-white border rounded shadow z-10 max-h-48 overflow-auto",
            className,
            classes?.list,
            showDropdown ? "opacity-100 translate-y-0" : baseAnimation
          )}
          onScroll={handleOptionsScroll}
          {...props}
        >
          {loading && (
            <li className={cn("px-3 py-2 text-gray-400", classes?.loading)}>
              {loadingText}
            </li>
          )}
          {!loading && error && (
            <li className={cn("px-3 py-2 text-red-500", classes?.error)}>
              {error}
            </li>
          )}
          {!loading && !error && inputValue.length === 0 && (
            <li
              className={cn("px-3 py-2 text-gray-400", classes?.typeToSearch)}
            >
              {typeToSearchText}
            </li>
          )}
          {!loading &&
            !error &&
            inputValue.length > 0 &&
            items.length === 0 && (
              <li className={cn("px-3 py-2 text-gray-400", classes?.empty)}>
                {emptyText}
              </li>
            )}
          {items.map((item, idx) => {
            if (isGroup(item)) {
              return (
                <li
                  key={`group-${item.id}`}
                  className={cn(
                    "sticky top-0 z-10 bg-white font-semibold text-[11px] tracking-wide px-3 py-1 text-slate-500 border-b",
                    classes?.groupHeader
                  )}
                >
                  {item.label}
                </li>
              );
            }
            return (
              <AutocompleteOption
                key={item.value || item.label || idx}
                item={item}
                index={idx}
                active={activeIndex === idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => handleSelect(item)}
                className={cn(
                  (props as any)?.optionClassName,
                  classes?.option,
                  activeIndex === idx && classes?.optionActive,
                  (item as any).disabled && classes?.optionDisabled
                )}
              />
            );
          })}
        </ul>
      )}
    </>
  );
}

// --------- Individual Option ---------
/**
 * Renderiza una opción individual, soporta render prop y seleccion por teclado.
 */
export function AutocompleteOption({
  item,
  index,
  active,
  render,
  ...props
}: {
  item: BaseAutocompleteOption;
  index: number;
  active: boolean;
  render?: (optionProps: RenderOptionProps) => ReactNode;
} & HTMLAttributes<HTMLLIElement>) {
  const { classes } = useAutocompleteContext();
  if (render) {
    return render({ item, index, active, ...props });
  }
  return (
    <li
      id={`autocomplete-item-${index}`}
      role="option"
      aria-selected={active}
      aria-disabled={item.disabled || false}
      className={cn(
        "cursor-pointer px-3 py-2 transition-colors duration-150 select-none",
        item.disabled
          ? cn("opacity-50 cursor-not-allowed", classes?.optionDisabled)
          : "hover:bg-blue-100",
        active && cn("bg-blue-100", classes?.optionActive),
        classes?.option,
        props.className
      )}
      {...props}
    >
      {item.label || item.value}
    </li>
  );
}

// --------- Animaciones CSS (puedes mover esto a tu archivo global) ---------
/*
.fade-slide {
  transition: all 0.2s ease-out;
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-show {
  opacity: 1;
  transform: translateY(0);
}
*/

// --------- Ejemplo de Uso con scroll infinito y clear button ---------
/*
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteOptions,
} from "./Autocomplete";

function fetchCities(query: string) {
  return Promise.resolve(
    ["Madrid", "Barcelona", "Valencia", "Sevilla"]
      .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
      .map((name) => ({ label: name, value: name }))
  );
}

function handleScrollEnd() {
  alert("Llegaste al final del scroll, deberías cargar más datos aquí.");
}

export default function Demo() {
  return (
    <Autocomplete
      fetchItems={fetchCities}
      onSelect={item => alert(item.label)}
      onScrollEnd={handleScrollEnd}
    >
      <AutocompleteInput placeholder="Buscar ciudad..." />
      <AutocompleteOptions />
    </Autocomplete>
  );
}
*/
