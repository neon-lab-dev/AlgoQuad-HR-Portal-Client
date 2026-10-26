/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, isValidElement } from "react";
import type { MouseEvent, ReactNode } from "react";
import { FiMoreVertical, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loader from "../../Shared/Loader/Loader";

// ---- Types ----
type TableColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => ReactNode;
};

type TableAction<T> = {
  icon: ReactNode | React.ComponentType<any>;
  label: string;
  onClick: (row: T) => void;
  className?: string;
  hidden?: (row: T) => boolean;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  rowKey: keyof T;
  isLoading?: boolean;

  // Pagination Props
  page?: number;
  onPageChange?: (page: number) => void;
  totalPages: number;
  limit: number;
  setLimit: (limit: number) => void;
};

const renderIcon = (icon: TableAction<any>["icon"]) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  if (typeof icon === "function") {
    const IconComp = icon as React.ComponentType<any>;
    return <IconComp />;
  }
  return null;
};

function Table<T extends Record<string, any>>({
  columns,
  data,
  actions = [],
  rowKey,
  isLoading,
  page = 1,
  onPageChange,
  totalPages,
  limit,
  setLimit,
}: TableProps<T>) {
  const [openMenu, setOpenMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    setOpenMenu((prev) =>
      prev?.id === id ? null : { id, x: clientX, y: clientY },
    );
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const totalCols = columns.length + (actions.length > 0 ? 1 : 0);

  // ---- Pagination Logic ----
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange?.(newPage);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    onPageChange?.(1); // Reset to page 1 when limit changes
  };

  // Generate page numbers (e.g., [1, 2, 3, ..., 10])
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-98 max-w-full relative">
      <div className={isLoading ? "" : "overflow-x-auto"}>
        <table className="min-w-full divide-y divide-neutral-98">
          <thead className="bg-neutral-105">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-neutral-60 uppercase tracking-wider ${
                    col.className || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-60 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={totalCols} className="p-0">
                  <div className="flex flex-col items-center justify-center py-20 w-full">
                    <Loader />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white divide-y divide-neutral-98">
              {data?.length > 0 ? (
                data.map((row) => (
                  <tr key={String(row[rowKey])} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-6 py-4 text-sm ${
                          col.className || "text-neutral-60"
                        }`}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}

                    {actions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                        <button
                          onClick={(e) => toggleMenu(e, String(row[rowKey]))}
                          className="text-neutral-60 hover:text-gray-700 focus:outline-none p-1 rounded hover:bg-gray-100 cursor-pointer"
                        >
                          <FiMoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={totalCols}
                    className="px-6 py-10 text-center text-sm text-neutral-60"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Dropdown */}
      {openMenu && (
        <div
          className="fixed z-50 w-50 bg-white rounded-md shadow-lg py-1 border border-neutral-98"
          style={{
            top: openMenu.y + 10,
            left: Math.max(openMenu.x - 180, 8),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {actions
            .filter((action) => {
              const row = data.find((r) => String(r[rowKey]) === openMenu.id);
              if (!row) return false;
              if (action.hidden && action.hidden(row)) return false;
              return true;
            })
            .map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const row = data.find(
                    (r) => String(r[rowKey]) === openMenu.id,
                  );
                  if (row) action.onClick(row);
                  setOpenMenu(null);
                }}
                className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer ${
                  action.className || ""
                }`}
              >
                {action.icon && (
                  <span className="mr-3">{renderIcon(action.icon)}</span>
                )}
                {action.label}
              </button>
            ))}
        </div>
      )}

      {/* ====== PAGINATION ====== */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-neutral-98 gap-4">
          {/* Left: Limit Selector */}
          <div className="flex items-center gap-2 text-sm text-neutral-60">
            <span>Show</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border border-neutral-98 rounded-md px-2 py-1 bg-white outline-none focus:border-primary-10 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          {/* Right: Page Controls */}
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="p-2 rounded-md hover:bg-neutral-105 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>

            {getPageNumbers().map((p, idx) => (
              <button
                key={idx}
                onClick={() => typeof p === "number" && handlePageChange(p)}
                disabled={p === "..."}
                className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-sm transition-colors ${
                  p === page
                    ? "bg-primary-10 text-white font-medium shadow-sm"
                    : p === "..."
                      ? "cursor-default text-neutral-65"
                      : "hover:bg-neutral-105 text-neutral-60 cursor-pointer"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => handlePageChange(page + 1)}
              className="p-2 rounded-md hover:bg-neutral-105 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
