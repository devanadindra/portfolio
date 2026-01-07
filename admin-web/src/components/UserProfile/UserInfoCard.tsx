import { useModalStatus } from "../../context/ModalContext";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import type { User } from "../../types/user";
import { useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { useAlert } from "../../context/AlertContext";
import { updateUser } from "../../services/userService";
import type { UpdateUserReq } from "../../request/userReq";
import { useUser } from "../../context/UserContext";
import type { DashboardRes } from "../../response/userResponse";
import { motion, Variants, AnimatePresence } from "framer-motion"; 

// --- VARIAN ANIMASI ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1, 
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const modalContentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: 30, transition: { duration: 0.2 } }
};

// ----------------------

// Fungsi helper untuk membersihkan data nomor telepon
const cleanPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, ''); 
    // Hapus '0' di awal jika ada
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1); 
    }
    // Hapus '+62' jika ada
    if (cleaned.startsWith('62')) {
        cleaned = cleaned.substring(2); 
    }
    // Batasi maksimal 13 digit
    return cleaned.slice(0, 13);
};

interface UserInfoCardProps {
  data: User | null;
  refetch: () => void;
}

export default function UserInfoCard({ data, refetch }: UserInfoCardProps) {
  if (!data) return null;
  const [formData, setFormData] = useState<UpdateUserReq>({
    Name: data.Name,
    Username: data.Username,
    Email: data.Email,
    PhoneNumber: cleanPhoneNumber(data.PhoneNumber), // Bersihkan data awal
  });
  const { isOpen, openModal, closeModal } = useModal();
  const { setLoading } = useLoading();
  const { openStatusModal } = useModalStatus();
  const { showAlert } = useAlert();
  const { setUser } = useUser();

  const handleOpenModal = () => {
    openModal(<div />); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler khusus untuk Phone Number
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Hapus semua karakter non-digit (fallback)
    value = value.replace(/\D/g, ''); 

    // Batasi maksimal 13 digit
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    
    // Hapus '0' di awal secara paksa
    if (value.length > 0 && value.startsWith('0')) {
        value = value.substring(1);
    }

    setFormData((prev) => ({
      ...prev,
      PhoneNumber: value,
    }));
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await updateUser(formData);
      if (!res.errors) {
        openStatusModal({
          status: "success",
          title: "Edit Success",
          message: "User data updated successfully!",
          onCloseCallback: () => {
            closeModal();
            refetch();
            setUser((prev: DashboardRes["data"] | null) =>
              prev ? { ...prev, Username: res.data.Username } : prev
            );
          },
        });
      } else {
        showAlert("error", "Edit Failed", "Failed to update user data!");
      }
    } catch (err) {
      showAlert("error", "Edit Failed", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            
            {/* Username */}
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Username
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.Username}
              </p>
            </motion.div>

            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Full Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.Name}
              </p>
            </motion.div>

            {/* Email address */}
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.Email}
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.PhoneNumber ? `(+62) ${data.PhoneNumber}` : '-'}
              </p>
            </motion.div>

            {/* Role */}
            <motion.div variants={itemVariants}>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.Username === "owner" ? "Owner" : "Admin"}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Tombol Edit aktifkan modal */}
        <motion.button
          variants={itemVariants}
          onClick={handleOpenModal}
          whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </motion.button>
      </div>

      {/* Modal Edit */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-info-content"
                    variants={modalContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl"
                >
                    <div className="px-2">
                        <h4 className="mt-5 mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Personal Information
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Update your details to keep your profile up-to-date.
                        </p>
                    </div>
                    <form
                        className="flex flex-col"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-2">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Personal Information
                                </h5>

                                <div className="grid grid-cols-1 gap-y-5 text-start">
                                    <div>
                                        <Label>Username</Label>
                                        <Input
                                            type="text"
                                            name="Username"
                                            value={formData.Username}
                                            onChange={handleChange}
                                            disabled={formData.Username === "owner"}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Full Name</Label>
                                        <Input
                                            type="text"
                                            name="Name"
                                            value={formData.Name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Email Address</Label>
                                        <Input
                                            type="email"
                                            name="Email"
                                            value={formData.Email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* PHONE NUMBER INPUT */}
                                    <div>
                                        <Label>Phone</Label>
                                        <div className="relative items-center">
                                            {/* Prefix Visual +62 */}
                                            <span className="absolute left-0 inline-flex h-full items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-white-200 dark:z-1">
                                              +62
                                            </span>
                                            
                                            {/* Input Field Utama */}
                                            <Input
                                              type="tel" 
                                              placeholder="81234567890" 
                                              name="PhoneNumber"
                                              value={formData.PhoneNumber}
                                              required
                                              onChange={handlePhoneNumberChange} 
                                              
                                              // Batasan karakter saat tombol ditekan
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
                                              
                                              // Kelas untuk padding dan styling
                                              className="ps-14 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Sesuaikan kelas Tailwind Anda di sini
                                            />
                                          </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button type="submit" size="sm">Save Changes</Button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
      </Modal>
    </motion.div>
  );
}