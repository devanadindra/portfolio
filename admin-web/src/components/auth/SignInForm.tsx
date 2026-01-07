import { useState } from "react";
import { motion, Variants } from "framer-motion"; // Import Framer Motion
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { loginAdmin } from "../../services/userService";
import { ROLE } from "../../utils/constants";
import { handleNavigate } from "../../utils/navigationHelper";
import { useLoading } from "../../context/LoadingContext";
import { useModalStatus } from "../../context/ModalContext";
import ResetPasswordModal from "./ResetPasswordModal";

// --- Framer Motion Variants untuk Animasi Teks Logo ---

const logoContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Jeda antar huruf
      delayChildren: 0.2,    // Jeda sebelum huruf pertama muncul
    },
  },
};

const logoItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

// --- Komponen Pembantu untuk Animasi Teks Logo ---
// Kita bisa menggunakan komponen yang sama atau membuat versi spesifik jika ada perbedaan styling/animasi
const AnimatedSignInLogoText: React.FC<{ text: string }> = ({ text }) => {
    const letters = Array.from(text);

    return (
        <motion.div
            className="text-4xl font-black text-gray-900 dark:text-white/90 flex whitespace-nowrap overflow-hidden"
            variants={logoContainerVariants}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    style={letter === ' ' ? { display: 'inline-block', width: '0.4em' } : {}}
                    variants={logoItemVariants}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};


// --- Variasi Animasi untuk Form (Sudah Ada) ---
const containerVariantsForm = { // Mengganti nama agar tidak konflik
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Variasi animasi untuk setiap item formulir (Sudah Ada)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

// ------------------------------------

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ Username: "", Password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { openStatusModal } = useModalStatus();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin({
        Username: formData.Username,
        Password: formData.Password,
        Role: ROLE,
      });
      if (!res.errors) {
        localStorage.setItem("username", formData.Username);
        localStorage.setItem("remember_me", rememberMe ? "true" : "false");
        sessionStorage.setItem("islogged_in", "true");
        openStatusModal({
          status: "success",
          title: "Login Success",
          message: "Welcome back!",
          onCloseCallback: () =>
            handleNavigate(
              navigate,
              "/home",
              undefined,
              setLoading,
              true,
              true
            ),
        });
      } else {
        openStatusModal({
          status: "warning",
          title: "Login Failed",
          message: "Incorrect username or password.",
        });
      }
    } catch (err) {
      openStatusModal({
        status: "danger",
        title: "Login Error",
        message: "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container utama diubah menjadi motion.div
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:-mt-0">
        <motion.div
          // Properti Framer Motion
          variants={containerVariantsForm} // Menggunakan variants yang sudah diganti namanya
          initial="hidden" // State awal
          animate="visible" // State yang dituju (memulai animasi)
        >
          {/* LOGO TEXT (Pengganti Gambar) dengan Animasi */}
          <motion.div
            variants={itemVariants}
            className="items-center justify-center sm:hidden -mt-60"
          >
            <div className="flex flex-col items-center mb-10">
              <AnimatedSignInLogoText text="No Time to Hell" />
            </div>
          </motion.div>

          {/* Judul & Deskripsi (diubah menjadi motion.div) */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-10">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Bagian form diubah menjadi motion.div untuk menerapkan stagger */}
            <motion.div className="space-y-6" variants={containerVariantsForm}> {/* Menggunakan variants yang sudah diganti namanya */}
              {/* Username Field (diubah menjadi motion.div) */}
              <motion.div variants={itemVariants} className="group">
                <Label>
                  Username <span className="text-error-500">*</span>{" "}
                </Label>
                <Input
                  type="text"
                  name="Username"
                  placeholder="enter your username"
                  value={formData.Username}
                  onChange={handleChange}
                />
              </motion.div>

              {/* Password Field (diubah menjadi motion.div) */}
              <motion.div variants={itemVariants} className="group">
                <Label>
                  Password <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                  />
                  {/* Gunakan motion pada span ikon mata untuk efek klik/hover */}
                  <motion.span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    whileHover={{ scale: 1.1 }} // Efek hover
                    whileTap={{ scale: 0.9 }} // Efek klik/tap
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </motion.span>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password (diubah menjadi motion.div) */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Checkbox checked={rememberMe} onChange={setRememberMe} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                {/* Link diubah menjadi motion.a */}
                <motion.button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  whileHover={{ scale: 1.05, color: "#6366f1" }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-brand-500 dark:text-brand-400"
                >
                  Forgot password?
                </motion.button>
              </motion.div>

              {/* Button (diubah menjadi motion.div) */}
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-full"
                >
                  <Button className="w-full" size="sm" type="submit">
                    Sign in
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
        <ResetPasswordModal
          key="reset-modal"
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
        />
      </div>
    </div>
  );
}