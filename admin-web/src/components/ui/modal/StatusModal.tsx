import { Modal } from ".";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "danger" | "warning" | "info";
  title: string;
  message: string;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  status,
  title,
  message,
}) => {
  const getStatusContent = () => {
    switch (status) {
      case "success":
        return {
          icon: <FiCheckCircle className="h-12 w-12 text-green-500" />,
          buttonColor: "bg-green-500 hover:bg-green-600",
        };
      case "danger":
        return {
          icon: <FiXCircle className="h-12 w-12 text-red-500" />,
          buttonColor: "bg-red-500 hover:bg-red-600",
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="h-12 w-12 text-yellow-500" />,
          buttonColor: "bg-yellow-500 hover:bg-yellow-600",
        };
      case "info":
        return {
          icon: <FiInfo className="h-12 w-12 text-blue-500" />,
          buttonColor: "bg-blue-500 hover:bg-blue-600",
        };
      default:
        return {
          icon: <FiInfo className="h-12 w-12 text-gray-500" />,
          buttonColor: "bg-gray-500 hover:bg-gray-600",
        };
    }
  };

  const { icon, buttonColor } = getStatusContent();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`
            mb-4 flex h-16 w-16 items-center justify-center rounded-full
            ${status === "success" && "bg-green-100 text-green-500"}
            ${status === "danger" && "bg-red-100 text-red-500"}
            ${status === "warning" && "bg-yellow-100 text-yellow-500"}
            ${status === "info" && "bg-blue-100 text-blue-500"}
          `}
        >
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full md:w-auto px-6 py-2 rounded-lg font-semibold text-white transition-colors ${buttonColor}`}
        >
          Okay, Got It
        </button>
      </div>
    </Modal>
  );
};