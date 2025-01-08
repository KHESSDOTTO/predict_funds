import { createContext, useContext, useState } from "react";
import type { CenarioType, UserType } from "@/utils/types/generalTypes/types";
import type { ReactNode } from "react";
import { UserContextType } from "./userContextTypes";

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  cenarios: [],
  setCenarios: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [cenarios, setCenarios] = useState<CenarioType[]>([]);
  return (
    <UserContext.Provider value={{ user, cenarios, setUser, setCenarios }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
