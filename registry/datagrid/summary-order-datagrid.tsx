"use client"
import { useState } from "react"
import type React from "react"

import { cn } from "@/lib/utils"

interface Column {
  accessor: string
  title: string
  render?: (item: any) => React.ReactNode
}

interface DataGridProps {
  simpleData: any[]
  columns: Column[]
  searchParams: {
    page: number
    pageSize: number
  }
  onSearchParamsChange: (params: any) => void
  enablePagination?: boolean
  enableSearch?: boolean
  emptyText?: string
}

export function DataGrid({
  simpleData,
  columns,
  searchParams,
  onSearchParamsChange,
  enablePagination = true,
  enableSearch = true,
  emptyText = "No hay datos disponibles",
}: DataGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter data based on search term
  const filteredData = searchTerm
    ? simpleData.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : simpleData

  if (!filteredData.length) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 mx-auto mb-3 opacity-50">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p>{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {enableSearch && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                  index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/25",
                )}
              >
                {columns.map((column) => (
                  <td key={column.accessor} className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {column.render ? column.render(item) : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enablePagination && filteredData.length > searchParams.pageSize && (
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>
            Mostrando {Math.min(searchParams.pageSize, filteredData.length)} de {filteredData.length} elementos
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSearchParamsChange({ ...searchParams, page: searchParams.page - 1 })}
              disabled={searchParams.page <= 1}
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Anterior
            </button>
            <span className="px-3 py-1">Página {searchParams.page}</span>
            <button
              onClick={() => onSearchParamsChange({ ...searchParams, page: searchParams.page + 1 })}
              disabled={searchParams.page * searchParams.pageSize >= filteredData.length}
              className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
