/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, isValidElement } from "react";
import type { MouseEvent, ReactNode } from "react";
import { FiMoreVertical } from "react-icons/fi";
import Button from "../Button/Button";
import Loader from "../../Shared/Loader/Loader";

type TableColumn<T> = {
  key: string;
  label: string;
  className?: string;
  /** Optional custom cell renderer. If omitted, row[key] is displayed. */
  render?: (row: T) => ReactNode;
};

type TableAction<T> = {
  /** Accepts either a React element (<FiEye />) or a component (FiEye). */
  icon: ReactNode | React.ComponentType<any>;
  label: string;
  onClick: (row: T) => void;
  className?: string;
  /** Optionally hide an action per row. */
  hidden?: (row: T) => boolean;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  rowKey: keyof T;
  isLoading?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
  totalPages: number;
};

/** Renders an icon prop that may be either a JSX element or a component reference. */
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
      prev?.id === id ? null : { id, x: clientX, y: clientY }
    );
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const totalCols = columns.length + (actions.length > 0 ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-98 divide-neutral-98 max-w-full overflow-x-auto relative">
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

        <tbody className="bg-white divide-y divide-neutral-98">
          {isLoading ? (
            <tr>
              <td colSpan={totalCols} className="px-6 py-10 text-center">
                <Loader />
              </td>
            </tr>
          ) : data?.length > 0 ? (
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
                className="px-6 py-4 text-center text-sm text-neutral-60"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Floating Dropdown */}
      {openMenu && (
        <div
          className="fixed z-50 w-50 bg-white rounded-md shadow-lg py-1 border border-neutral-98"
          style={{
            top: openMenu.y + 10,
            left: Math.max(openMenu.x - 180, 8), // clamp to viewport left
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {actions
            .filter((action) => {
              const row = data.find(
                (r) => String(r[rowKey]) === openMenu.id
              );
              if (!row) return false;
              if (action.hidden && action.hidden(row)) return false;
              return true;
            })
            .map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const row = data.find(
                    (r) => String(r[rowKey]) === openMenu.id
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end pr-4 py-3 border-t border-neutral-98 text-sm text-neutral-70">
          <Button
            disabled={page === 1}
            variant="tertiary"
            onClick={() => onPageChange?.(page - 1)}
            label="Previous"
            classNames="ml-4 px-3 py-1 rounded hover:bg-gray-100"
          />
          <span className="mx-2">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <Button
            disabled={page === totalPages}
            variant="tertiary"
            onClick={() => onPageChange?.(page + 1)}
            label="Next"
            classNames="ml-4 px-3 py-1 rounded hover:bg-gray-100"
          />
        </div>
      )}
    </div>
  );
}

export default Table;