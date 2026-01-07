import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useModalStatus } from "../../context/ModalContext";
import { useLoading } from "../../context/LoadingContext";
import {
  resetPasswordReq,
  resetPasswordSubmit,
} from "../../services/userService";
import { Modal } from "../ui/modal";
import { useAlert } from "../../context/AlertContext";
import { ROLE } from "../../utils/constants";

const MIN_PASSWORD_LENGTH = 6; // Tetapkan panjang minimum password

const modalContentVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
};

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [data, setData] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dataRef = useRef<HTMLInputElement | null>(null);
  const newPassRef = useRef<HTMLInputElement | null>(null);
  const confirmPassRef = useRef<HTMLInputElement | null>(null);
  const { showAlert } = useAlert();
  const { openStatusModal } = useModalStatus();
  const { setLoading } = useLoading();

  const handleCloseAndReset = () => {
    onClose();
    // Reset state ke kondisi awal
    setStep(1);
    setData("");
    setNewPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  // Validasi Step 2 (Panjang dan Kesesuaian Password)
  const passwordError = useMemo(() => {
    if (newPassword && newPassword.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return "New passwords do not match.";
    }
    return null;
  }, [newPassword, confirmPassword]);

  // Status validitas form Step 2 untuk tombol submit
  const isStep2Valid = useMemo(() => {
    return (
      !passwordError &&
      newPassword.length >= MIN_PASSWORD_LENGTH &&
      confirmPassword.length > 0
    );
  }, [passwordError, newPassword, confirmPassword]);
  
  // Helper function untuk styling
  const getInputClass = (isInvalid: boolean) => {
    const baseClass = "w-full pl-10 pr-12 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2";
    const borderClass = isInvalid 
        ? "border-red-500 focus:ring-red-500" 
        : "border-gray-300 focus:ring-blue-500 dark:border-gray-600";
    return `${baseClass} ${borderClass}`;
  };

  /* ---------------------- PARSING LOGIC ---------------------- */

  /**
   * Memparsing data input (Nomor Telepon atau Email) untuk dikirim ke BE.
   * - Jika data adalah Email (mengandung '@'), data dikirim apa adanya.
   * - Jika data adalah Nomor Telepon, awalan '0', '62', atau '+62' akan dihapus.
   * @param inputData Data mentah dari input field.
   * @returns Data yang sudah diparsing atau data asli.
   */
  const parseDataForAPI = (inputData: string): string => {
    const trimmedData = inputData.trim();
    
    // 1. Jika mengandung '@', asumsikan itu Email, jangan diparsing.
    if (trimmedData.includes('@')) {
      return trimmedData;
    }

    // 2. Asumsikan Nomor Telepon.
    // Hapus semua karakter non-digit kecuali tanda '+' jika ada di awal.
    let phone = trimmedData.replace(/[^0-9+]/g, '');

    // Hapus awalan umum: '+62', '62', '0'
    if (phone.startsWith('+62')) {
      phone = phone.substring(3);
    } else if (phone.startsWith('62')) {
      phone = phone.substring(2);
    } else if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }
    
    return phone;
  };

  /* ---------------------- HANDLERS ---------------------- */

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.trim()) {
      showAlert(
        "error",
        "Validation",
        "Please enter your email or phone number."
      );
      return;
    }
    
    // --- PENGGUNAAN FUNGSI PARSING BARU ---
    const dataToSend = parseDataForAPI(data);

    if (!dataToSend) {
        showAlert("error", "Validation", "Invalid phone number or email format.");
        return;
    }
    // -------------------------------------

    setLoading(true);
    // Gunakan dataToSend yang sudah diparsing
    const formDataReq = { Data: dataToSend, Role: ROLE }; 
    const res = await resetPasswordReq(formDataReq);
    setLoading(false);

    if (res && !res.errors) {
      setUsername(res.data.Username);
      setStep(2);
    } else {
      showAlert(
        "error",
        "Failed",
        res?.errors || "User not found or connection error."
      );
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cukup cek status isStep2Valid
    if (!isStep2Valid) {
        showAlert(
            "error",
            "Validation",
            passwordError || "Please fill in the password fields correctly."
        );
        return;
    }

    setLoading(true);
    const formData = {
      Username: username,
      NewPassword: newPassword,
      Role: ROLE,
    };
    const res = await resetPasswordSubmit(formData);
    setLoading(false);

    if (res && !res.errors) {
      openStatusModal({
        status: "success",
        title: "Success",
        message:
          "Password changed successfully. Please login with your new password.",
      });
      handleCloseAndReset();
    } else {
      openStatusModal({
        status: "danger",
        title: "Failed",
        message: res?.errors || "An error occurred during password reset.",
      });
    }
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleCloseAndReset}
          className="max-w-md w-full m-4 p-0"
        >
          <motion.div
            key="modal-content"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white dark:bg-gray-800 p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 inline-block rounded-full mb-4">
                <FaLock className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reset Password
              </h2>
            </div>

            {/* Step 1: Input Data */}
            {step === 1 && (
              <form className="space-y-6" onSubmit={handleStep1Submit}>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <label htmlFor="user-data" className="sr-only">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      id="user-data"
                      type="text"
                      ref={dataRef}
                      placeholder="Enter Email or Phone Number"
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      // Menggunakan class dasar untuk Step 1
                      className={getInputClass(false)} 
                      required
                    />
                  </div>
                </motion.div>
                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={!data.trim()}
                >
                  Request Reset
                </motion.button>
              </form>
            )}

            {/* Step 2: Input New Password */}
            {step === 2 && (
              <form className="space-y-6" onSubmit={handleStep2Submit}>
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-4 p-3 bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 text-sm rounded-md"
                >
                  <p>
                    Changing password for user:{" "}
                    <strong className="font-bold">{username}</strong>
                  </p>
                </motion.div>

                {/* Input New Password */}
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    ref={newPassRef}
                    placeholder={`New Password (min ${MIN_PASSWORD_LENGTH} chars)`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    // Border merah jika password terlalu pendek
                    className={getInputClass(
                      !!newPassword && newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH
                    )}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                </div>

                {/* Input Confirm Password */}
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    ref={confirmPassRef}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    // Border merah jika ada error (match atau panjang)
                    className={getInputClass(!!passwordError && confirmPassword.length > 0)}
                    required
                  />

                  {/* Toggle Show Password Button */}
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                </div>

                {/* Error Message */}
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}

                <motion.button
                  type="submit"
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-gray-400"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={!isStep2Valid} // Menggunakan isStep2Valid
                >
                  Change Password
                </motion.button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
                >
                  &larr; Back to request
                </button>
              </form>
            )}
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordModal;