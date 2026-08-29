import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const TableComponent = ({
  columns,
  data,
  searchable = true,
  pagination = true,
  pageSize = 10,
  className = '',
  emptyMessage = 'No data available'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = data.filter(item =>
    searchable && searchTerm
      ? columns.some(column =>
          String(item[column.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = pagination
    ? filteredData.slice(startIndex, startIndex + pageSize)
    : filteredData;

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-950/90 overflow-hidden ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-sm">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900/60 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {paginatedData.length > 0 ? (
          <table className="w-full table-fixed">
            <thead className="bg-slate-900/70">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider ${index === 0 ? 'pl-6' : ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6 bg-transparent">
              {paginatedData.map((item, rowIndex) => (
                <motion.tr
                  key={item.id || rowIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="hover:bg-slate-900/60 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-slate-200 min-w-0 wrap-break-word ${colIndex === 0 ? 'pl-6' : ''}`}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')
                      }
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-500">{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/6 flex items-center justify-between bg-slate-900/70">
          <div className="text-sm text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-white/6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900/60 transition-colors"
            >
              <HiOutlineChevronLeft className="h-4 w-4 text-slate-200" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (page > totalPages) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-cyan-500 text-white'
                        : 'text-slate-300 hover:bg-slate-900/60'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-white/6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900/60 transition-colors"
            >
              <HiOutlineChevronRight className="h-4 w-4 text-slate-200" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;