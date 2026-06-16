import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import Pagination from './Pagination';

interface AdminDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  emptyMessage: string;
  pageSize?: number;
}

export default function AdminDataTable<T>({ data, columns, emptyMessage, pageSize = 10 }: AdminDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const totalPages = table.getPageCount();
  const firstVisible = data.length === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const lastVisible = Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={header.column.getCanSort() ? 'inline-flex items-center gap-1 hover:text-accent' : ''}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: '↑',
                          desc: '↓',
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center py-12 text-gray-400">{emptyMessage}</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            Showing {firstVisible}-{lastVisible} of {data.length}
          </p>
          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalPages={totalPages}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
      )}
    </>
  );
}
