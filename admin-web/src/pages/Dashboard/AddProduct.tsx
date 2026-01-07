import { useState } from "react";
// Import Framer Motion
import { motion, Variants } from "framer-motion";

import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import { addProduct } from "../../services/productService";
import type { AddProductReq } from "../../request/productReq";
import { useAlert } from "../../context/AlertContext";
import { handleNavigate } from "../../utils/navigationHelper";
import { useNavigate } from "react-router";
import { useLoading } from "../../context/LoadingContext";
import { useModalStatus } from "../../context/ModalContext";
import TextAreaHTML from "../../components/form/input/TextAreaHTML";
import { FaSpinner } from "react-icons/fa"; // Icon untuk spinner

// --- Framer Motion Variants ---

// Varian untuk seluruh konten (fade-in dan slide-up ringan)
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

// Varian untuk setiap elemen form (Label, Input, Select, Dropzone)
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Varian untuk Input/Textarea Wrapper
const inputWrapperVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// ---------------------------------------------

// Komponen Input yang Dibungkus Motion
const MotionInput = motion(Input);
const MotionTextAreaHTML = motion(TextAreaHTML);

export default function AddProduct() {
  useAlert();
  const navigate = useNavigate();
  const { openStatusModal } = useModalStatus();
  const { setLoading } = useLoading();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [images, setImages] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [capital, setCapital] = useState("");
  const [link, setLink] = useState("");

  const handleSelectChange = (
    key: "department" | "category",
    value: string
  ) => {
    if (key === "category") {
      setSelectedCategory(value);

      if (value === "Pants") {
        const pantsSizes: Record<string, number> = {};
        for (let i = 28; i <= 34; i++) pantsSizes[i.toString()] = 0;
        pantsSizes["All Size"] = 0;
        setSizes(pantsSizes);
      } else if (value === "Accessories") {
        setSizes({ "All Size": 0 });
      } else {
        setSizes({ S: 0, M: 0, L: 0, XL: 0, "All Size": 0 });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!selectedCategory) return alert("Please select category");

    setIsSubmitting(true);

    const sizeArray = Object.keys(sizes).map((key) => ({
      size: key,
      stock: sizes[key],
    }));

    const productData: AddProductReq = {
      name,
      description,
      price,
      capital,
      weight,
      department: "NTH",
      category: selectedCategory,
      sizes: sizeArray,
      images,
      link,
    };

    try {
      const res = await addProduct(productData);
      if (!res.errors) {
        openStatusModal({
          status: "success",
          title: "Success",
          message: "Product added successfully",
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
        openStatusModal({
          status: "danger",
          title: "Error",
          message: `Product add failed ${res.errors}`,
        });
      }
    } catch (err) {
      openStatusModal({
        status: "danger",
        title: "Error",
        message: `Failed to add product`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Membungkus seluruh ComponentCard dengan motion.div untuk animasi halaman
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <ComponentCard title="Add New Product">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Weight */}
          <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
            <motion.div variants={inputWrapperVariants}>
              <Label htmlFor="name">Product Name</Label>
              <MotionInput
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </motion.div>
            <motion.div variants={inputWrapperVariants}>
              <Label htmlFor="weight">Weight (gram)</Label>
              <div
                onWheel={(e) => e.currentTarget.querySelector("input")?.blur()}
              >
                <MotionInput
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  id="weight"
                  value={weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setWeight(val);
                  }}
                  required
                  className="no-spin"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <Label htmlFor="description">Description</Label>
            <MotionTextAreaHTML
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="resize-none"
            />
          </motion.div>

          {/* Product Link */}
          <motion.div variants={itemVariants}>
            <Label htmlFor="link">Product Link</Label>
            <MotionInput
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              required
            />
          </motion.div>

          {/* Price & Capital */}
          <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
            <motion.div variants={inputWrapperVariants}>
              <Label htmlFor="price">Price</Label>
              <div
                onWheel={(e) => e.currentTarget.querySelector("input")?.blur()}
              >
                <MotionInput
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  id="price"
                  value={price}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setPrice(val);
                  }}
                  placeholder="0"
                  min={0}
                  required
                  className="no-spin"
                />
              </div>
            </motion.div>
            <motion.div variants={inputWrapperVariants}>
              <Label htmlFor="capital">Capital</Label>
              <div
                onWheel={(e) => e.currentTarget.querySelector("input")?.blur()}
              >
                <MotionInput
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  id="capital"
                  value={capital}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setCapital(val);
                  }}
                  placeholder="0"
                  min={0}
                  required
                  className="no-spin"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Category */}
          <motion.div variants={itemVariants}>
            <Label>Category</Label>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Select
                options={categories}
                placeholder="Select category"
                onChange={(val) => handleSelectChange("category", val)}
                />
            </motion.div>
          </motion.div>

          {/* Stock per Size */}
          <motion.div variants={itemVariants}>
            <Label>Stock per Size</Label>
            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-5 gap-4"
                initial="hidden"
                animate="visible"
                variants={pageVariants} // Menggunakan pageVariants untuk stagger input ukuran
            >
              {Object.keys(sizes).map((size) => (
                <motion.div key={size} variants={inputWrapperVariants}>
                  <Label>Size: {size}</Label>
                  <div
                    onWheel={(e) =>
                      e.currentTarget.querySelector("input")?.blur()
                    }
                  >
                    <div
                      onWheel={(e) =>
                        e.currentTarget.querySelector("input")?.blur()
                      }
                    >
                      <MotionInput
                        type="number"
                        min={0}
                        value={sizes[size]}
                        onChange={(e) =>
                          setSizes({
                            ...sizes,
                            [size]: parseInt(e.target.value) || 0,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "." || e.key === ",")
                            e.preventDefault();
                        }}
                        className="no-spin"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dropzone */}
          <motion.div variants={itemVariants}>
            <DropzoneComponent onChange={setImages} />
          </motion.div>

          {/* Submit Button dengan Loading Spinner */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            whileHover={!isSubmitting ? { scale: 1.05 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
              >
                {/* Menggunakan FaSpinner dari react-icons. Warna putih (text-white) diambil dari kelas tombol utama */}
                <FaSpinner className="h-4 w-4" /> 
              </motion.span>
            )}
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </motion.button>
        </form>
      </ComponentCard>
    </motion.div>
  );
}