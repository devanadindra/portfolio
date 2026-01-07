import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router";
import type { Product } from "../../types/product";
import { API_BASE } from "../../utils/constants";
import { rowVariants } from "./ProductListConstants"; // Import dari file Constants

interface ProductRowProps {
  product: Product;
  index: number;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  onDeleteClick: (id: string) => void;
  // 💡 Prop untuk mengatasi dropdown tenggelam
  isLastRow: boolean; 
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  index,
  activeMenuId,
  setActiveMenuId,
  onDeleteClick,
  isLastRow, // Menerima prop isLastRow
}) => {
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setActiveMenuId(activeMenuId === product.ID ? null : product.ID);
  };

  const formattedDate = (() => {
    const date = new Date(product.CreatedAt);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  })();

  const formattedDepartment =
    product.Department === "NTH" ? "No Time To Hell" : product.Department;

  // 💡 LOGIKA UNTUK DROPDOWN: Menentukan posisi dan arah animasi
  const dropdownClasses = isLastRow 
    ? "bottom-full mb-2 origin-bottom-right" // Buka ke atas
    : "top-full mt-2 origin-top-right";      // Buka ke bawah
    
  const initialY = isLastRow ? 10 : -10;
  const exitY = isLastRow ? 10 : -10;

  return (
    <motion.tr
      key={product.ID}
      custom={index}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={rowVariants}
      className="border-t border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
    >
      <td className="hidden sm:table-cell px-6 py-4">
        <img
          src={`${API_BASE}${product.ProductImages?.[0]?.URL || "default.jpg"}`}
          alt={product.Name}
          className="w-16 h-16 object-cover rounded-md"
        />
      </td>
      <td className="px-6 py-4 font-medium dark:text-white">{product.Name}</td>
      <td className="hidden sm:table-cell px-6 py-4 dark:text-gray-400">
        {product.Category}
      </td>
      <td className="hidden md:table-cell px-6 py-4 dark:text-gray-400">
        {formattedDepartment}
      </td>
      <td className="px-6 py-4 dark:text-gray-400">
        Rp {product.Price.toLocaleString()}
      </td>
      <td className="hidden sm:table-cell px-6 py-4">
        <motion.span
          whileHover={{ scale: 1.1 }}
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            product.TotalStock > 0
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {product.TotalStock}
        </motion.span>
      </td>
      <td className="hidden lg:table-cell px-6 py-4 dark:text-gray-400">
        {formattedDate}
      </td>
      <td className="px-6 py-4 text-right relative">
        <AnimatePresence>
          {/* Tombol Aksi */}
          <motion.button
            id={`action-button-${product.ID}`}
            className="dark:text-gray-400 hover:text-white transition"
            onClick={handleToggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MdOutlineMoreHoriz size={20} />
          </motion.button>

          {activeMenuId === product.ID && (
            // Menu Dropdown
            <motion.div
              key="action-menu"
              id={`action-menu-${product.ID}`}
              initial={{ opacity: 0, y: initialY }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: exitY }}
              transition={{ duration: 0.2 }}
              className={`absolute right-0 w-32 bg-white dark:bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 ${dropdownClasses}`}
            >
              <motion.button
                onClick={() => navigate(`/product/detail/${product.ID}`)}
                className="w-full text-left px-4 py-2 dark:text-gray-100 dark:hover:bg-gray-700 hover:bg-gray-300 transition duration-150"
                whileHover={{ x: 5 }}
              >
                View More
              </motion.button>
              <motion.button
                onClick={() => navigate(`/product/update/${product.ID}`)}
                className="w-full text-left px-4 py-2 dark:text-gray-100 dark:hover:bg-gray-700 hover:bg-gray-300 transition duration-150"
                whileHover={{ x: 5 }}
              >
                Edit
              </motion.button>
              <motion.button
                className="w-full text-left px-4 py-2 text-red-500 dark:hover:bg-gray-700 hover:bg-gray-300 transition duration-150"
                onClick={() => onDeleteClick(product.ID)}
                whileHover={{ x: 5, color: "#ef4444" }}
              >
                Delete
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
};

export default ProductRow;