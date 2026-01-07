import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

// Imports Sub-Components & Constants
import ProductListSkeleton from "../../components/productList/ProductListSkeleton";
import ProductRow from "../../components/productList/ProductRow";
import ProductListHeader from "../../components/productList/ProductListHeader";
import { contentVariants } from "../../components/productList/ProductListConstants";
import PaginationComponent from "../../components/pagination/PaginationComponent";

// Service & Types Imports
import type { Product } from "../../types/product";
import { fetchProducts, deleteProduct } from "../../services/productService";
import { useModalStatus } from "../../context/ModalContext";
import { useConfirmModal } from "../../context/ConfirmModalContext";


const ProductsList = () => {
  const [loadingTable, setLoadingTable] = useState(false);
  const { openStatusModal } = useModalStatus();
  const { openConfirmModal } = useConfirmModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);
  const [searchParams] = useSearchParams();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  // Logika DELETE (tetap sama)
  const handleDeleteClick = (productId: string) => {
    openConfirmModal({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this product?",
      onConfirm: async () => {
        try {
          await handleDelete(productId);
        } catch (err) {
          openStatusModal({
            status: "danger",
            title: "Delete Failed",
            message: String(err),
          });
        }
      },
    });
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await deleteProduct(productId);
      if (!res.errors) {
        openStatusModal({
          status: "success",
          title: "Delete Success",
          message: "Product deleted successfully",
          onCloseCallback: () => loadData(currentPage),
        });
      } else {
        openStatusModal({
          status: "danger",
          title: "Delete Failed",
          message: "Product deleted failed!",
        });
      }
    } catch (error) {
      openStatusModal({
        status: "danger",
        title: "Delete Failed",
        message: `Failed to delete product: ${error}`,
      });
    }
  };

  // Logika FETCH DATA (tetap sama)
  const loadData = async (page: number) => {
    setLoadingTable(true);
    const start = Date.now();

    try {
      const { data, total } = await fetchProducts(
        category,
        String(limit),
        String(page),
        keyword
      );
      setProducts(data);
      setTotalProducts(total);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      const delay = 1000 - (Date.now() - start);
      setTimeout(() => {
        setLoadingTable(false);
      }, Math.max(0, delay));
    }
  };

  // Efek: Muat ulang saat filter/search berubah (tetap sama)
  useEffect(() => {
    loadData(1);
  }, [category, keyword]);

  // Efek: Muat ulang saat currentPage berubah (tetap sama)
  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  // Efek: Menutup menu aksi saat klik di luar (tetap sama)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const actionMenu = document.getElementById(`action-menu-${activeMenuId}`);
      const actionButton = document.getElementById(
        `action-button-${activeMenuId}`
      );

      if (
        activeMenuId &&
        actionMenu &&
        actionButton &&
        !actionMenu.contains(event.target as Node) &&
        !actionButton.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeMenuId]);

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <motion.div
      className="p-4 dark:bg-gray-900 min-h-screen dark:text-gray-100 font-sans"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Header dan Search/Filter */}
        <ProductListHeader keyword={keyword} category={category} />

        {/* Table */}
        <div className="rounded-lg border border-gray-700 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-300 dark:bg-gray-700 dark:text-gray-300 uppercase">
              <tr>
                <th className="hidden sm:table-cell px-6 py-3">Image</th>
                <th className="px-6 py-3">Product</th>
                <th className="hidden sm:table-cell px-6 py-3">Category</th>
                <th className="hidden md:table-cell px-6 py-3">Brand</th>
                <th className="px-6 py-3">Price</th>
                <th className="hidden sm:table-cell px-6 py-3">Stock</th>
                <th className="hidden lg:table-cell px-6 py-3">Created At</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {/* Conditional Rendering Tabel/Skeleton/No Data - SOLUSI ANIMATEPRESENCE */}
              <AnimatePresence mode="wait">
                {loadingTable ? (
                  <ProductListSkeleton key="skeleton" rowCount={limit} />
                ) : products.length > 0 ? (
                  // 🚀 SOLUSI: Bungkus array hasil map ke dalam Fragment dengan KEY
                  <React.Fragment key="products-list">
                    {products.map((product, index) => {
                      // 💡 Logika isLastRow: 2 baris terakhir akan buka ke atas
                      const isLastRow = index >= products.length - 1;

                      return (
                        <ProductRow
                          key={product.ID}
                          product={product}
                          index={index}
                          activeMenuId={activeMenuId}
                          setActiveMenuId={setActiveMenuId}
                          onDeleteClick={handleDeleteClick}
                          isLastRow={isLastRow} // Kirim prop ke ProductRow
                        />
                      );
                    })}
                  </React.Fragment>
                ) : (
                  <motion.tr
                    key="no-data"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { duration: 0.3 } },
                    }}
                  >
                    <td
                      colSpan={8}
                      className="text-center dark:text-gray-400 py-4"
                    >
                      No products available
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination menggunakan PaginationComponent yang sudah dibuat */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalOrders={totalProducts} // totalOrders di PaginationComponent = totalProducts di sini
          limit={limit}
          onPageChange={loadData} // loadData berfungsi sebagai handler perubahan halaman
          loadingTable={loadingTable}
        />
      </div>
    </motion.div>
  );
};

export default ProductsList;
