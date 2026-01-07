import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router";
// ASUMSI: Import tipe data ProductRes dari lokasi yang benar
import type { ProductRes } from "../../response/ProductResponse"; 
import { fetchDetailProducts } from "../../services/productService";
import { API_BASE } from "../../utils/constants";
// ASUMSI: ComponentCard dan useAlert tersedia
import ComponentCard from "../../components/common/ComponentCard"; 
import { useAlert } from "../../context/AlertContext";

import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaBoxes,
  FaDollarSign,
  FaWeight,
  FaTags,
  FaLink,
  FaDatabase,
  FaInfoCircle,
  FaThList,
  FaRulerCombined,
} from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";

// =================================================================
// 1. DEFINISI VARIANTS & HELPER
// =================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const imageVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } },
};

const thumbnailVariants: Variants = {
  hover: {
    scale: 1.05,
    borderColor: "#3B82F6",
    boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
  },
  tap: { scale: 0.95 },
};

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  }),
};

// --- Komponen Detail Item Pembantu ---
interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  highlight?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  icon,
  highlight = false,
}) => (
  <motion.div
    variants={itemVariants}
    className={`flex items-center justify-between border-b dark:border-gray-700 py-2 last:border-b-0 
        ${
          highlight
            ? "font-bold text-blue-400"
            : "text-gray-700 dark:text-gray-400"
        }`}
  >
    <div className="flex items-center space-x-2">
      {icon}
      <span className="font-semibold text-gray-400 dark:text-gray-200">
        {label}
      </span>
    </div>
    <span
      className={`${
        highlight ? "text-blue-400" : "text-gray-500 dark:text-gray-300"
      } text-right`}
    >
      {value}
    </span>
  </motion.div>
);

// --- Komponen Loading (Minimalis) ---
// (Dibiarkan sama seperti kode asli Anda)
const ProductDetailSkeleton = () => (
  <motion.section
    className="py-8 dark:bg-gray-900 md:py-16 antialiased text-gray-100"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    key="skeleton-loader"
  >
    <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
        <div className="flex flex-col gap-6">
          <motion.div
            className="flex flex-col-reverse gap-4 shrink-0 max-w-md lg:max-w-none mx-auto lg:flex-row lg:h-150 w-150"
            variants={itemVariants}
          >
            <motion.div className="flex gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:flex-col lg:w-24">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-700 rounded-lg animate-pulse"
                  variants={itemVariants}
                ></motion.div>
              ))}
            </motion.div>
            <motion.div
              className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-700 animate-pulse"
              variants={itemVariants}
            ></motion.div>
          </motion.div>
        </div>
        <motion.div className="mt-6 sm:mt-8 lg:mt-0" variants={itemVariants}>
          <ComponentCard title="Product Details">
            <div className="flex space-x-2 mb-4">
              <div className="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
            </div>
            <div className="p-4 space-y-4">
              <motion.div
                className="h-7 bg-gray-700 rounded w-3/4 mb-4 animate-pulse"
                variants={itemVariants}
              ></motion.div>
              <motion.div
                className="h-8 bg-gray-700 rounded w-1/2 mb-6 animate-pulse"
                variants={itemVariants}
              ></motion.div>
              <motion.div
                className="h-4 bg-gray-700 rounded w-full animate-pulse"
                variants={itemVariants}
              ></motion.div>
              <motion.div
                className="h-4 bg-gray-700 rounded w-11/12 animate-pulse"
                variants={itemVariants}
              ></motion.div>
            </div>
          </ComponentCard>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

// =================================================================
// 2. KOMPONEN KONTEN TAB TERPISAH
// =================================================================

interface TabProps {
  product: ProductRes;
}

const TabContentInfo: React.FC<TabProps> = ({ product }) => (
  <div className="space-y-4">
    <motion.h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
      {product.Name}
    </motion.h1>

    <motion.div className="flex items-end justify-between border-b border-gray-700 pb-4">
      <p className="text-4xl font-extrabold text-blue-500">
        Rp. {product.Price.toLocaleString()}
      </p>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-400">
        Current Stock: {product.TotalStock}
      </p>
    </motion.div>

    <motion.div>
      <h3 className="text-xl font-semibold mb-2 text-gray-400 dark:text-gray-200">
        Description
      </h3>
      <p className="text-gray-700 dark:text-gray-400 whitespace-pre-line text-sm leading-relaxed">
        {product.Description}
      </p>
    </motion.div>

    <motion.div className="text-gray-900 dark:text-gray-300 space-y-1 pt-4 border-t border-gray-700">
      <DetailItem
        icon={<FaWeight className="text-sm" />}
        label="Weight"
        value={`${product.Weight} gram`}
      />
      <DetailItem
        icon={<MdOutlineCategory className="text-lg" />}
        label="Category"
        value={product.Category}
      />
      <DetailItem
        icon={<FaTags className="text-sm" />}
        label="Department"
        value="No Time to Hell"
      />

      {product.Link && (
        <DetailItem
          icon={<FaLink className="text-sm" />}
          label="External Link"
          value={
            <a
              href={product.Link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-400 break-all"
            >
              View Link
            </a>
          }
        />
      )}
    </motion.div>
  </div>
);

const TabContentCapital: React.FC<TabProps> = ({ product }) => (
  <div className="space-y-4">
    <p className="text-gray-700 dark:text-gray-400">
      Detailed breakdown of inventory status and capital invested in this product.
    </p>
    <motion.div
      className="space-y-2 pt-2 border-t border-gray-700"
      variants={containerVariants}
    >
      <DetailItem
        icon={<FaDatabase className="text-sm" />}
        label="Deposit Stock"
        value={product.ProductCapital.TotalStock}
      />
      <DetailItem
        icon={<FaDollarSign className="text-sm" />}
        label="Capital per Item"
        value={`Rp. ${product.ProductCapital.CapitalPerItem.toLocaleString()}`}
      />
      <DetailItem
        icon={<FaBoxes className="text-sm" />}
        label="TOTAL CAPITAL"
        value={`Rp. ${product.ProductCapital.TotalCapital.toLocaleString()}`}
        highlight={true}
      />
    </motion.div>
  </div>
);

const TabContentStock: React.FC<TabProps> = ({ product }) => (
  <div className="space-y-4">
    <p className="text-gray-700 dark:text-gray-400 mb-4">
      Distribution of current stock quantities across different sizes.
    </p>

    {product.StockDetails && product.StockDetails.length > 0 ? (
      <motion.div
        className="space-y-2 pt-2 border-t border-gray-700"
        variants={containerVariants}
      >
        {product.StockDetails.map((detail) => (
          <DetailItem
            key={detail.ID}
            icon={<FaRulerCombined className="text-sm text-gray-500" />}
            label={`Size: ${detail.Size}`}
            value={
              <span
                className={`font-semibold ${
                  detail.Stock === 0 ? "text-red-500" : "text-green-400"
                }`}
              >
                {detail.Stock} pcs
              </span>
            }
            highlight={detail.Stock === 0}
          />
        ))}
      </motion.div>
    ) : (
      <motion.p className="text-gray-500">
        No specific size stock details available.
      </motion.p>
    )}
  </div>
);

// =================================================================
// 3. WRAPPER TINGGI DINAMIS BARU
// =================================================================

interface DynamicWrapperProps {
  activeTab: ActiveTab;
  direction: number;
  product: ProductRes;
}

const DynamicHeightWrapper: React.FC<DynamicWrapperProps> = ({
  activeTab,
  direction,
  product,
}) => {
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const contentRef = useRef<HTMLDivElement>(null);

  // Gunakan useMemo untuk merender konten yang diukur
  const ContentToMeasure = useMemo(() => {
    switch (activeTab) {
      case 'info':
        return <TabContentInfo product={product} />;
      case 'capital':
        return <TabContentCapital product={product} />;
      case 'stock':
        return <TabContentStock product={product} />;
      default:
        return null;
    }
  }, [activeTab, product]); // Bergantung pada tab aktif dan data produk

  useEffect(() => {
    // Pengukuran dilakukan setelah DOM stabil (setelah render)
    const timer = setTimeout(() => {
      if (contentRef.current) {
        // Atur tinggi kontainer utama
        setHeight(contentRef.current.offsetHeight);
      }
    }, 50); // Delay kecil untuk memastikan DOM sudah stabil

    return () => clearTimeout(timer);
  }, [activeTab, product]); // Re-run saat tab atau produk berubah

  return (
    // motion.div utama yang menganimasikan tinggi
    <motion.div
      className="relative overflow-hidden"
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* 1. Konten untuk Pengukuran (Tersembunyi) */}
      <div 
        ref={contentRef} 
        className="absolute w-full"
        // Style untuk menyembunyikan elemen tetapi tetap diukur oleh DOM
        style={{ visibility: 'hidden', pointerEvents: 'none', position: 'absolute' }} 
      >
        {ContentToMeasure}
      </div>

      {/* 2. Konten untuk Tampilan dan Animasi */}
      <AnimatePresence initial={false} custom={direction}>
        {activeTab === 'info' && (
          <motion.div
            key="info-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute top-0 left-0 w-full"
          >
            <TabContentInfo product={product} />
          </motion.div>
        )}

        {activeTab === 'capital' && (
          <motion.div
            key="capital-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute top-0 left-0 w-full"
          >
            <TabContentCapital product={product} />
          </motion.div>
        )}

        {activeTab === 'stock' && (
          <motion.div
            key="stock-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute top-0 left-0 w-full"
          >
            <TabContentStock product={product} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// =================================================================
// 4. KOMPONEN UTAMA PRODUCT DETAIL
// =================================================================

type ActiveTab = "info" | "capital" | "stock";
const TAB_ORDER = ['info', 'capital', 'stock'];

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const { showAlert } = useAlert();

  const [activeTab, setActiveTab] = useState<ActiveTab>("info");
  const [direction, setDirection] = useState(0);

  const handleImageLoad = (url: string) => {
    setLoadedImages((prev) => [...prev, url]);
  };

  // Logika Arah Slide yang Diperbaiki
  const changeTab = (tab: ActiveTab) => {
    if (tab === activeTab) return;

    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const newIndex = TAB_ORDER.indexOf(tab);

    // Hitung arah: jika indeks baru > indeks lama, arah positif (1)
    const newDir = newIndex > currentIndex ? 1 : -1;

    setDirection(newDir);
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setLoadedImages([]);
      try {
        const { data } = await fetchDetailProducts(productId!);
        setProduct(data);
        const imageUrls =
          data?.ProductImages.map((img) => `${API_BASE}${img.URL}`) || [];
        if (imageUrls.length > 0) {
          setSelectedImage(imageUrls[0]);
        } else {
          setSelectedImage("/placeholder.png");
        }
      } catch (error) {
        showAlert(
          "error",
          "Error",
          `Failed to fetch product details: ${error}`
        );
      } finally {
        // Hapus setTimeout jika tidak diperlukan untuk UX
        setLoading(false); 
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <ProductDetailSkeleton key="loading-minimal" />
      ) : !product ? (
        <motion.div
          key="not-found"
          className="flex items-center justify-center h-screen w-full text-center dark:bg-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
        >
          <h2 className="mt-2 text-2xl text-gray-400">Product Not Found!</h2>
        </motion.div>
      ) : (
        <motion.section
          key="content"
          className="py-8 dark:bg-gray-900 md:py-16 antialiased text-gray-100"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
              {/* KOLOM KIRI: GAMBAR */}
              <div className="flex flex-col gap-6">
                <motion.div
                  className="flex flex-col-reverse gap-4 shrink-0 max-w-md lg:max-w-none mx-auto lg:flex-row"
                  variants={itemVariants}
                >
                  {/* Thumbnail Gallery (Tidak Ada Perubahan) */}
                  <motion.div
                    className="flex gap-3 overflow-x-auto lg:overflow-x-visible lg:h-full pb-2 lg:pb-0 lg:flex-col lg:w-24"
                    variants={containerVariants}
                  >
                    {/* ... (Mapping ProductImages) ... */}
                    {product.ProductImages.length > 0 ? (
                      product.ProductImages.map((img) => {
                        const imgUrl = `${API_BASE}${img.URL}`;
                        const isSelected = selectedImage === imgUrl;
                        const isLoaded = loadedImages.includes(imgUrl);

                        return (
                          <motion.div
                            key={img.ID}
                            className={`relative w-20 h-20 lg:w-24 lg:h-24 p-1 border rounded-lg cursor-pointer transition-all duration-200 shrink-0
                              ${
                                isSelected
                                  ? "border-blue-500 ring-2 ring-blue-500"
                                  : "border-gray-700 hover:border-blue-400"
                              }
                            `}
                            onClick={() => setSelectedImage(imgUrl)}
                            variants={thumbnailVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <img
                              src={imgUrl}
                              alt={`Thumbnail ${img.ID}`}
                              className={`w-full h-full object-cover rounded-md ${isLoaded ? 'image-loaded' : 'blur-load'}`}
                              onLoad={() => handleImageLoad(imgUrl)}
                            />
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.div
                        className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-700 flex items-center justify-center rounded-lg text-gray-400"
                        variants={itemVariants}
                      >
                        No Image
                      </motion.div>
                    )}
                  </motion.div>
                  {/* Main Image (Tidak Ada Perubahan) */}
                  <motion.div
                    className="flex-1 border dark:border-gray-700 rounded-lg overflow-hidden flex items-center justify-center dark:bg-gray-800 max-h-[450px]"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedImage}
                        src={selectedImage}
                        alt="Selected Product"
                        className={`w-full h-full max-h-full object-contain ${loadedImages.includes(selectedImage) ? 'image-loaded' : 'blur-load'}`}
                        variants={imageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onLoad={() => handleImageLoad(selectedImage)}
                      />
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>

              {/* KOLOM KANAN: DETAIL PRODUK & INVENTORY */}
              <motion.div
                className="mt-6 sm:mt-8 lg:mt-0"
                variants={itemVariants}
              >
                <ComponentCard title="Product Details">
                  <motion.div className="space-y-4" variants={containerVariants}>
                    {/* Tab Controls (Tidak Ada Perubahan) */}
                    <motion.div
                      className="grid grid-cols-3 border-b dark:border-gray-700 mb-4"
                      variants={itemVariants}
                    >
                      {/* Tab 1: Information */}
                      <button
                        onClick={() => changeTab("info")}
                        className={`flex flex-col items-center justify-center p-2 text-xs md:text-sm font-semibold transition-colors duration-200 text-center
                                ${
                                  activeTab === "info"
                                    ? "text-blue-500 border-b-2 border-blue-500 bg-blue-500/10"
                                    : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                      >
                        <FaInfoCircle className="mb-0.5 text-lg md:text-base" />
                        <span className="hidden sm:inline">Information</span>
                        <span className="sm:hidden">Info</span>
                      </button>

                      {/* Tab 2: Inventory & Capital */}
                      <button
                        onClick={() => changeTab("capital")}
                        className={`flex flex-col items-center justify-center p-2 text-xs md:text-sm font-semibold transition-colors duration-200 text-center border-x dark:border-gray-800
                                ${
                                  activeTab === "capital"
                                    ? "text-blue-500 border-b-2 border-blue-500 bg-blue-500/10"
                                    : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                      >
                        <FaDollarSign className="mb-0.5 text-lg md:text-base" />
                        <span className="hidden sm:inline">
                          Inventory & Capital
                        </span>
                        <span className="sm:hidden">Capital</span>
                      </button>

                      {/* Tab 3: Stock Breakdown */}
                      <button
                        onClick={() => changeTab("stock")}
                        className={`flex flex-col items-center justify-center p-2 text-xs md:text-sm font-semibold transition-colors duration-200 text-center
                                ${
                                  activeTab === "stock"
                                    ? "text-blue-500 border-b-2 border-blue-500 bg-blue-500/10"
                                    : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                      >
                        <FaThList className="mb-0.5 text-lg md:text-base" />
                        <span className="hidden sm:inline">
                          Stock Breakdown
                        </span>
                        <span className="sm:hidden">Stock</span>
                      </button>
                    </motion.div>

                    {/* Penerapan Wrapper Tinggi Dinamis */}
                    <DynamicHeightWrapper
                      activeTab={activeTab}
                      direction={direction}
                      product={product}
                    />
                  </motion.div>
                </ComponentCard>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default ProductDetail;