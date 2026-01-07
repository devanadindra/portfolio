import React from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  onPageChange: (page: number) => void;
  loadingTable: boolean;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalOrders,
  limit,
  onPageChange,
  loadingTable,
}) => {
  if (totalOrders === 0) return null;

  const hoverState = { scale: 1.05 };
  const tapState = { scale: 0.95 };
  
  // Menggunakan style yang konsisten dengan contoh kedua
  const baseButtonClass = "px-3 py-1 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed";

  const renderPageNumbers = () => {
    // Jika total halaman kurang dari atau sama dengan 7, tampilkan semua
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    if (currentPage > 1 && currentPage < totalPages) {
        if (currentPage - 1 > 1 && !pages.includes(currentPage - 1)) pages.push(currentPage - 1);
        if (!pages.includes(currentPage)) pages.push(currentPage);
        if (currentPage + 1 < totalPages && !pages.includes(currentPage + 1)) pages.push(currentPage + 1);
    } else if (currentPage === 1) {
        if (totalPages >= 2) pages.push(2);
        if (totalPages >= 3) pages.push(3);
    } else if (currentPage === totalPages) {
        if (totalPages >= 3) pages.push(totalPages - 2);
        if (totalPages >= 2) pages.push(totalPages - 1);
    }
    
    if (currentPage < totalPages - 2 && totalPages > 4) {
      pages.push('...');
    }
    
    // Tampilkan halaman terakhir, jika belum ada dan totalPages > 1
    if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
    }
    
    // Hapus duplikasi dan pastikan urutan
    const finalPages = pages.filter((value, index, self) => 
        self.indexOf(value) === index
    ).sort((a, b) => {
        if (a === '...') return 1000;
        if (b === '...') return -1000;
        return (a as number) - (b as number);
    });

    const finalFiltered = finalPages.filter((val, idx, arr) => {
        if (val === '...') {
            return idx !== 0 && idx !== arr.length - 1 && arr[idx-1] !== '...';
        }
        return true;
    });

    // Perbaikan terakhir: Jika currentPage berada di 1 atau totalPages, pastikan urutannya benar
    if (totalPages > 4) {
        return finalFiltered.filter((val, idx, arr) => {
            // Jika kita berada di awal atau akhir, pastikan kita tidak menampilkan terlalu banyak titik-titik
            if (val === '...' && ((currentPage <= 3 && idx === 1) || (currentPage >= totalPages - 2 && idx === arr.length - 2))) {
                return false;
            }
            return true;
        });
    }


    return finalFiltered;
  };
  

  return (
    <div className="flex justify-between items-center mt-6 text-gray-400">
      {/* Teks Informasi */}
      <span className="text-sm dark:text-gray-300">
        Showing {Math.min((currentPage - 1) * limit + 1, totalOrders)} to{" "}
        {Math.min(currentPage * limit, totalOrders)} of {totalOrders} datas
      </span>

      {/* Kontrol Pagination */}
      <div className="flex space-x-2">
        {/* Tombol Sebelumnya */}
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loadingTable}
          className={`${baseButtonClass} bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-400 dark:hover:bg-gray-600`}
          whileHover={hoverState}
          whileTap={tapState}
        >
          <FaChevronLeft className="w-3 h-3"/>
        </motion.button>

        {/* Nomor Halaman */}
        {renderPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={index}
                className="px-3 py-1.5 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }
          const isCurrent = page === currentPage;
          const buttonClasses = isCurrent
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white";

          return (
            <motion.button
              key={page}
              onClick={() => onPageChange(page as number)}
              disabled={isCurrent || loadingTable}
              className={`${baseButtonClass} ${buttonClasses}`}
              // Mengganti penggunaan objek kosong ({}) dengan null atau undefined
              // Dan memastikan tipe yang diteruskan adalah TargetAndTransition
              whileHover={isCurrent ? undefined : hoverState} 
              whileTap={isCurrent ? undefined : tapState} 
            >
              {page}
            </motion.button>
          );
        })}

        {/* Tombol Berikutnya */}
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loadingTable}
          className={`${baseButtonClass} bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-400 dark:hover:bg-gray-600`}
          whileHover={hoverState}
          whileTap={tapState}
        >
          <FaChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
    </div>
  );
};

export default PaginationComponent;
