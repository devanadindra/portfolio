import { useState, useMemo } from "react"; // Tambahkan useMemo
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { register } from "../../services/userService";
import { useAlert } from "../../context/AlertContext";
import { useModalStatus } from "../../context/ModalContext";
import { CONST_USER } from "../../utils/constants";
import Blank from "../Blank";
import { motion, Variants } from "framer-motion";

// Animation variants definitions remain unchanged
const formItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Spinner Component remains unchanged
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

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();
  const { openStatusModal } = useModalStatus();

  // Form state
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const user = localStorage.getItem("username");

  // =========================================================================
  // LOGIKA VALIDASI MENGGUNAKAN useMemo INLINE
  // =========================================================================
  const validation = useMemo(() => {
    // Cek apakah semua field wajib (required) sudah terisi
    const isRequiredFieldsFilled = 
      username.trim() !== "" &&
      name.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "";

    // 1. Cek Kesamaan Password
    const isPasswordMatch = password === confirmPassword;

    // 2. Cek Panjang Nomor Telepon
    const isPhoneInvalid =
      phoneNumber.length > 0 &&
      (phoneNumber.length < 8 || phoneNumber.length > 13);
      
    // 3. Status Tombol Submit
    const isDisabled =
      isSubmitting || 
      !isRequiredFieldsFilled || // Tombol mati jika ada field kosong
      !isPasswordMatch || 
      isPhoneInvalid;

    // 4. Cek Password Match untuk pesan error di bawah input (opsional)
    const showPasswordMismatch = 
        confirmPassword.length > 0 && password.length > 0 && !isPasswordMatch;

    return {
      isPasswordMatch,
      isPhoneInvalid,
      isDisabled,
      showPasswordMismatch
    };
  }, [
    isSubmitting,
    username,
    name,
    phoneNumber,
    password,
    confirmPassword,
  ]);
  // =========================================================================


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Karena validasi sudah dihandle oleh `isDisabled` pada tombol,
    // kita hanya perlu memastikan tidak ada validasi synchronous yang diulang di sini.
    // Kita hapus pengecekan: 
    // if (password !== confirmPassword) { ... }
    // if (phoneNumber.length > 13) { ... } 
    // karena tombol sudah non-aktif jika salah.

    if (validation.isDisabled && !isSubmitting) {
        // Ini adalah fallback safety, seharusnya tidak terpanggil jika tombol dinonaktifkan dengan benar
        showAlert("error", "Validation Error", "Please correct the errors in the form before submitting.");
        return;
    }


    setIsSubmitting(true);

    try {
      const res = await register({
        Username: username,
        Name: name,
        PhoneNumber: "62" + phoneNumber,
        Password: password,
      });

      if (!res.errors) {
        openStatusModal({
          status: "success",
          title: "Account Created Successfully", 
          message: "Admin registered successfully!", 
        });
        setUsername("");
        setName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
      } else {
        openStatusModal({
          status: "danger",
          title: "Registration Failed", 
          message: `Failed: ${res.errors}`, 
        });
      }
    } catch (err) {
      openStatusModal({
        status: "danger",
        title: "Registration Failed", 
        message: "Something went wrong", 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    // Batasan maksimal 13 digit dilakukan di onChange, 
    // dan validasi < 8 atau > 13 dilakukan di useMemo
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    if (value.length > 0 && value[0] === "0") {
      value = value.slice(1);
    }

    setPhoneNumber(value);
  };
  
  // Mengganti isDisabled dan isInvalidLength dengan nilai dari useMemo
  const { isDisabled, isPhoneInvalid, showPasswordMismatch } = validation;


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar mt-10"
    >
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {user === CONST_USER ? (
          <div>
            {/* Title and Description */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mb-5 sm:mb-8"
            >
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Create Admin Account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fill the form to create an admin account! 
              </p>
            </motion.div>
            <div>
              <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <div className="space-y-5">
                  {/* Username */}
                  <motion.div variants={formItemVariants}>
                    <Label>
                      Username<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-brand-300 focus:border-brand-500"
                    />
                  </motion.div>
                  {/* Full Name */}
                  <motion.div variants={formItemVariants}>
                    <Label>
                      Full Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter Full Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-brand-300 focus:border-brand-500"
                    />
                  </motion.div>
                  {/* Phone Number */}
                  <motion.div variants={formItemVariants}>
                    <Label>
                      Phone Number<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      {/* Addon +62 */}
                      <span className="absolute start-0 top-0 h-full flex items-center px-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-s-lg select-none pointer-events-none dark:z-1">
                        +62
                      </span>

                      {/* Input Nomor Telepon */}
                      <Input
                        type="text"
                        placeholder="81234567890"
                        value={phoneNumber}
                        required
                        onChange={handlePhoneNumberChange}
                        onKeyDown={(e) => {
                          if (
                            !/[\d]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        // Tambahkan kelas error border jika invalid
                        className={`ps-14 w-full transition-all duration-300 ${isPhoneInvalid ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'focus:ring-brand-300 focus:border-brand-500'}`}
                      />
                    </div>
                    {/* Menggunakan nilai dari useMemo */}
                    {isPhoneInvalid && (
                      <p className="mt-1 text-xs text-error-500">
                        Must be between 8 and 13 digits.
                      </p>
                    )}
                  </motion.div>
                  {/* Password */}
                  <motion.div variants={formItemVariants}>
                    <Label>
                      Password<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your password" 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-brand-300 focus:border-brand-500"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                      </span>
                    </div>
                  </motion.div>
                  {/* Confirm Password */}
                  <motion.div variants={formItemVariants}>
                    <Label>
                      Confirm Password<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Confirm your password" 
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        // Tambahkan kelas error border jika password tidak cocok
                        className={`transition-all duration-300 ${showPasswordMismatch ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'focus:ring-brand-300 focus:border-brand-500'}`}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                      </span>
                    </div>
                    {/* Menggunakan nilai dari useMemo */}
                    {showPasswordMismatch && (
                      <p className="mt-1 text-xs text-error-500">
                        Password and Confirm Password must match.
                      </p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={formItemVariants}>
                    <motion.button
                      type="submit"
                      // Menggunakan isDisabled dari useMemo
                      disabled={isDisabled} 
                      className={`
                        flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs
                        ${
                          isDisabled
                            ? "bg-brand-400 cursor-not-allowed"
                            : "bg-brand-500 hover:bg-brand-600"
                        }
                      `}
                      // Animasi hover/tap
                      whileHover={
                        isDisabled
                          ? {}
                          : {
                              scale: 1.02,
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }
                      }
                      whileTap={isDisabled ? {} : { scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          Submitting...
                        </>
                      ) : (
                        "Submit" 
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.form>
            </div>
          </div>
        ) : (
          <Blank />
        )}
      </div>
    </motion.div>
  );
}