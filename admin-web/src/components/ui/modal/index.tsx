import { useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // <-- Import framer-motion

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

// --- VARIAN ANIMASI ---

// Varian untuk Overlay (Fade In/Out)
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Varian untuk Modal Box (Scale dan Fade)
const modalBoxVariants: Variants = {
  hidden: { y: -50, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30 
    } 
  },
  exit: { y: 50, opacity: 0, scale: 0.95 },
};

// ----------------------

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Efek untuk menangani tombol ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Efek untuk mengunci scroll body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Jika tidak terbuka, kembalikan null
  if (!isOpen) return null;
  
  // Logika penentuan class untuk konten modal
  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full max-w-lg mx-4 p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg";

  return (
    // Membungkus dengan AnimatePresence untuk menangani animasi keluar
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-wrapper"
          className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[1000]"
        >
          {/* Overlay Blur (Dianimasikan) */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            onClick={onClose}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* Modal Box (Dianimasikan) */}
          <motion.div
            ref={modalRef}
            className={`${contentClasses} ${className} relative`}
            onClick={(e) => e.stopPropagation()}
            variants={modalBoxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10" // Tambah z-10 agar tombol selalu di atas
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <div className="flex flex-col items-center text-center">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};