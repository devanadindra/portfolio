import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

interface ProductListHeaderProps {
  keyword: string;
  category: string;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  keyword,
  category,
}) => {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold dark:text-white">
            Products List
          </h1>
          <p className="text-sm dark:text-gray-400">
            Track your store's progress to boost your sales.
          </p>
        </div>
        {/* Tombol Add Product */}
        <motion.button
          onClick={() => navigate("/product/add")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Add Product
        </motion.button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 rounded-md border dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
            value={keyword}
            onChange={(e) =>
              setSearchParams({
                keyword: e.target.value,
                category,
                page: "1", // Reset page saat pencarian berubah
              })
            }
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400" />
        </div>
        {/* Tombol Filter */}
        <motion.button
          className="w-full md:w-auto flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-md border dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiFilter className="dark:text-gray-400" />
          <span className="dark:text-white">Filter</span>
        </motion.button>
      </div>
    </>
  );
};

export default ProductListHeader;