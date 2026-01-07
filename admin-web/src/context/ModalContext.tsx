// src/context/ModalContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { StatusModal } from "../components/ui/modal/StatusModal";

interface StatusModalProps {
  status: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  onCloseCallback?: () => void; // Tambahkan properti ini
}

interface ModalContextType {
  openStatusModal: (props: StatusModalProps) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<StatusModalProps & { isOpen: boolean }>({
    isOpen: false,
    status: 'info',
    title: '',
    message: '',
    onCloseCallback: undefined, // Inisialisasi properti baru
  });

  const openStatusModal = (props: StatusModalProps) => {
    setModalState({
      ...props,
      isOpen: true,
    });
  };

  const closeModal = () => {
    // Jalankan callback jika ada sebelum menutup modal
    if (modalState.onCloseCallback) {
      modalState.onCloseCallback();
    }
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ openStatusModal, closeModal }}>
      {children}
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        status={modalState.status}
        title={modalState.title}
        message={modalState.message}
      />
    </ModalContext.Provider>
  );
};

export const useModalStatus = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};