import { createContext, useContext, useState, ReactNode } from "react";
import Alert from "../components/ui/alert/Alert";

interface AlertContextType {
  showAlert: (variant: "success" | "error" | "warning" | "info", title: string, message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    visible: boolean;
  }>({ variant: "info", title: "", message: "", visible: false });

  const showAlert = (variant: "success" | "error" | "warning" | "info", title: string, message: string) => {
    setAlertData({ variant, title, message, visible: true });
    setTimeout(() => setAlertData(prev => ({ ...prev, visible: false })), 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertData.visible && (
        <div className="fixed top-5 right-5 z-[2000]">
          <Alert variant={alertData.variant} title={alertData.title} message={alertData.message} />
        </div>
      )}
    </AlertContext.Provider>
  );
};
