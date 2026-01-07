import { createContext, useContext, useState, ReactNode } from "react";
import { ConfirmModal } from "../components/ui/modal/ConfirmModal";

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
}

interface ConfirmModalContextType {
  openConfirmModal: (options: ConfirmOptions) => void;
  closeConfirmModal: () => void;
}

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined);

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

  const openConfirmModal = (options: ConfirmOptions) => {
    setConfirmOptions(options);
  };

  const closeConfirmModal = () => {
    setConfirmOptions(null);
  };

  return (
    <ConfirmModalContext.Provider value={{ openConfirmModal, closeConfirmModal }}>
      {children}
      <ConfirmModal
        isOpen={!!confirmOptions}
        title={confirmOptions?.title || ""}
        message={confirmOptions?.message || ""}
        onConfirm={() => {
          confirmOptions?.onConfirm();
          closeConfirmModal();
        }}
        onCancel={closeConfirmModal}
      />
    </ConfirmModalContext.Provider>
  );
};

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error("useConfirmModal must be used within a ConfirmModalProvider");
  }
  return context;
};
