import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { updateProduct } from "../../services/productService";
import type { UpdateProductReq } from "../../request/productReq";
import { useAlert } from "../../context/AlertContext";
import { handleNavigate } from "../../utils/navigationHelper";
import { useNavigate, useParams } from "react-router";
import { useLoading } from "../../context/LoadingContext";
import { fetchDetailProducts } from "../../services/productService";
import { API_BASE } from "../../utils/constants";
import { FaTrash, FaCheck } from "react-icons/fa";
import StockSlider from "../../components/form/input/NumberSlider";
import { useModalStatus } from "../../context/ModalContext";
import { useConfirmModal } from "../../context/ConfirmModalContext";
import TextAreaHTML from "../../components/form/input/TextAreaHTML";
import { motion, Variants } from "framer-motion";

// Definisi varian animasi untuk digunakan pada setiap bagian form
const formItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Komponen Spinner Sederhana
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function UpdateProduct() {
  const { productId } = useParams<{ productId: string }>();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { openStatusModal } = useModalStatus();
  const { openConfirmModal } = useConfirmModal();

  // Tambahkan state untuk status submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "Shirt", label: "Shirt" },
    { value: "Pants", label: "Pants" },
    { value: "Jacket", label: "Jacket" },
    { value: "T-Shirt", label: "T-Shirt" },
    { value: "Longsleeve Tees", label: "Longsleeve Tees" },
    { value: "Crewneck", label: "Crewneck" },
    { value: "Hoodie", label: "Hoodie" },
    { value: "Women Top", label: "Women Top" },
    { value: "Accessories", label: "Accessories" },
  ];

  const [visibleImages, setVisibleImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [oldImages, setOldImages] = useState<{ id: string; url: string }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<
    { productID: string; url: string }[]
  >([]);

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [capital, setCapital] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          const { data } = await fetchDetailProducts(productId);
          if (data) {
            setName(data.Name ?? "");
            setWeight(data.Weight?.toString() ?? "");
            setDescription(data.Description ?? "");
            setPrice(data.Price?.toString() ?? "");
            setCapital(data.ProductCapital.CapitalPerItem?.toString() ?? "");
            setLink(data.Link ?? "");
            setSelectedCategory(data.Category ?? "");

            const stockObj: Record<string, number> = {};
            data.StockDetails?.forEach((s) => {
              stockObj[s.Size] = s.Stock;
            });
            setSizes(stockObj);
            setOldImages(
              data.ProductImages?.map((img) => ({
                id: img.ID,
                url: img.URL,
              })) || []
            );
          }
        }
      } catch (err) {
        showAlert("error", "Failed to fetch product details", "");
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleUpdateClick = async () => {
    // Tombol tidak berfungsi jika sedang loading
    if (isSubmitting) return;

    openConfirmModal({
      title: "Confirm Update",
      message: "Are you sure you want to update this product?",
      onConfirm: async () => {
        // Mengubah status loading saat proses konfirmasi dimulai
        setIsSubmitting(true);
        try {
          await handleSubmit();
        } catch (err) {
          openStatusModal({
            status: "danger",
            title: "Update Failed",
            message: String(err),
          });
        } finally {
          // Penting: Pastikan status loading direset setelah selesai/gagal
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCategory) return alert("Category is required.");

    const sizeArray = Object.keys(sizes).map((key) => ({
      size: key,
      stock: sizes[key],
    }));

    const productData: UpdateProductReq = {
      productId: productId!,
      name,
      description,
      price,
      capital,
      weight,
      department: "NTH",
      category: selectedCategory,
      sizes: sizeArray,
      images: newImages,
      removedImages,
      link,
    };

    try {
      const res = await updateProduct(productData);
      if (!res.errors) {
        openStatusModal({
          status: "success",
          title: "Success",
          message: "Product updated successfully",
          onCloseCallback: () =>
            handleNavigate(
              navigate,
              "/product",
              undefined,
              setLoading,
              true,
              true
            ),
        });
      } else {
        showAlert("error", `Update failed: ${res.errors}`, "");
      }
    } catch (err) {
      // showAlert dipanggil di handleUpdateClick (bagian catch),
      // tapi jika ada error di sini, kita tetap tangani (walaupun modal utama sudah menangani).
      showAlert("error", `Failed to update product`, "");
    }
  };

  useEffect(() => {
    if (!oldImages.length) return;

    setVisibleImages([]);

    oldImages.forEach((img, index) => {
      setTimeout(() => {
        setVisibleImages((prev) => {
          if (prev.some((i) => i.url === img.url)) return prev;
          return [...prev, img];
        });
      }, index * 100);
    });
  }, [oldImages]);

  // Varian untuk menampung semua item form agar bisa di-stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Penundaan 0.1 detik antara setiap elemen anak
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ComponentCard
        title={
          <motion.span
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Update Product
          </motion.span>
        }
      >
        <motion.form
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Name & Weight */}
          <motion.div
            variants={formItemVariants}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (gram)</Label>
              <div
                onWheel={(e) => e.currentTarget.querySelector("input")?.blur()}
              >
                <Input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  className="no-spin transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={formItemVariants}>
            <Label htmlFor="description">Description</Label>
            <TextAreaHTML
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            />
          </motion.div>

          {/* Product Link */}
          <motion.div variants={formItemVariants}>
            <Label htmlFor="link">Product Link</Label>
            <Input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            />
          </motion.div>

          {/* Price & Capital */}
          <motion.div
            variants={formItemVariants}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <Label htmlFor="price">Price</Label>
              <div
                onWheel={(e) => e.currentTarget.querySelector("input")?.blur()}
              >
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min={0}
                  required
                  className="no-spin transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="capital">Capital</Label>
              <div
                onWheel={(e) => e.currentTarget.querySelector("input")?.blur()}
              >
                <Input
                  type="number"
                  id="capital"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  placeholder="0"
                  min={0}
                  required
                  disabled
                  className="no-spin transition-all duration-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </motion.div>

          {/* Category */}
          <motion.div variants={formItemVariants}>
            <Label>Category</Label>
            <Select
              options={categories}
              placeholder="Select category"
              value={selectedCategory || ""}
              disabled
              onChange={(val) => setSelectedCategory(val)}
              className="disabled:opacity-75"
            />
          </motion.div>

          {/* Stock per Size */}
          <motion.div variants={formItemVariants}>
            <Label>Stock per Size</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Diubah menjadi grid 1-3 kolom agar slider punya ruang yang cukup */}
              {Object.keys(sizes).map((size) => (
                <motion.div
                  key={size}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {/* PENGGANTIAN DARI NUMBERPICKER KE STOCKSLIDER */}
                  <StockSlider
                    size={size} // Meneruskan ukuran sebagai label
                    value={sizes[size]}
                    min={0}
                    // Anda bisa menyesuaikan max sesuai kebijakan stok Anda
                    max={100}
                    onChange={(val) => setSizes({ ...sizes, [size]: val })}
                  />
                  {/* Jika Anda ingin tetap menampilkan NumberPicker untuk input yang presisi,
                  Anda bisa menampilkannya di bawah slider:
                  <NumberPicker
                    value={sizes[size]}
                    min={0}
                    max={100}
                    onChange={(val) => setSizes({ ...sizes, [size]: val })}
                  /> 
                  */}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            variants={formItemVariants}
            className="mt-4 grid grid-cols-4 gap-4"
          >
            {visibleImages.map((img) => {
              const isMarked = removedImages.some((r) => r.url === img.url);
              return (
                <motion.div
                  key={img.id}
                  className="relative border rounded p-1"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={`${API_BASE}${img.url}`}
                    alt="Product"
                    className="w-full h-full object-cover rounded"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (isMarked) {
                        setRemovedImages((prev) =>
                          prev.filter((r) => r.url !== img.url)
                        );
                      } else {
                        setRemovedImages((prev) => [
                          ...prev,
                          { productID: productId!, url: img.url },
                        ]);
                      }
                    }}
                    className={`absolute top-1 right-1 bg-white rounded-full p-1 shadow flex items-center justify-center transition-transform duration-150 hover:scale-110`}
                  >
                    {isMarked ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <FaTrash className="text-red-600" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Dropzone */}
          <motion.div variants={formItemVariants}>
            <DropzoneComponent onChange={setNewImages} />
          </motion.div>

          {/* Update Button */}
          <motion.button
            type="button"
            onClick={handleUpdateClick}
            disabled={isSubmitting} // Menonaktifkan tombol saat submit
            className={`
              px-6 py-2 rounded-md transition duration-300 flex items-center justify-center
              ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
            // Animasi hover/tap dinonaktifkan jika sedang submit
            whileHover={
              isSubmitting
                ? {}
                : { scale: 1.05, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }
            }
            whileTap={isSubmitting ? {} : { scale: 0.95 }}
            variants={formItemVariants}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </motion.button>
        </motion.form>
      </ComponentCard>
    </motion.div>
  );
}
