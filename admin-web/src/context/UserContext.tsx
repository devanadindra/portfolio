import { createContext, useContext, useState, ReactNode } from "react";
import type { DashboardRes } from "../response/userResponse";

interface UserContextType {
  user: DashboardRes["data"] | null;
  setUser: (user: DashboardRes["data"] | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardRes["data"] | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
