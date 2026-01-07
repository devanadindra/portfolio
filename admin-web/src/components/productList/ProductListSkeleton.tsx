import { motion } from "framer-motion";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  rowVariants,
  skeletonRowVariants,
} from "./ProductListConstants"; // Import dari file Constants

const ProductListSkeleton = ({ rowCount = 8 }: { rowCount?: number }) => (
  <>
    {[...Array(rowCount)].map((_, index) => (
      <motion.tr
        key={index}
        className="border-t dark:border-gray-700 dark:bg-gray-800"
        custom={index}
        initial="hidden"
        animate="visible"
        variants={rowVariants}
      >
        {/* Kolom Image - Hidden sm:table-cell */}
        <td className="hidden sm:table-cell px-6 py-4">
          <motion.div
            className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-md"
            variants={skeletonRowVariants}
            initial="initial"
            animate="animate"
          />
        </td>

        {/* Kolom Product */}
        <td className="px-6 py-4">
          <motion.div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"
            variants={skeletonRowVariants}
            initial="initial"
            animate="animate"
          />
        </td>

        {/* Kolom Category - Hidden sm:table-cell */}
        <td className="hidden sm:table-cell px-6 py-4">
          <motion.div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/5"
            variants={skeletonRowVariants}
            initial="initial"
            animate="animate"
          />
        </td>

        {/* Kolom Brand - Hidden md:table-cell */}
        <td className="hidden md:table-cell px-6 py-4">
          <motion.div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"
            variants={skeletonRowVariants}
            initial="initial"
            animate="animate"
          />
        </td>

        {/* Kolom Price */}
        <td className="px-6 py-4">
          <motion.div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/5"
            variants={skeletonRowVariants}
            initial="initial"
            animate="animate"
          />
        </td>

        {/* Kolom Stock - Hidden sm:table-cell */}
        <td className="hidden sm:table-cell px-6 py-4">
          <motion.div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"
            variants={skeletonRowVariants}
            initial="initial"
            animate="animate"
          />
        </td>

        {/* Kolom Created At - Hidden lg:table-cell */}
        <td className="hidden lg:table-cell px-6 py-4">
          <motion.div
            className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/5"
            variants={skeletonRowVariants}
            initial="initial"
            animate="animate"
          />
        </td>

        {/* Kolom Aksi */}
        <td className="px-6 py-4">
          <MdOutlineMoreHoriz size={20} className="dark:text-gray-600" />
        </td>
      </motion.tr>
    ))}
  </>
);

export default ProductListSkeleton;