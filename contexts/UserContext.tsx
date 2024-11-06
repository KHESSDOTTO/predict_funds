import { createContext, useState } from "react";
import type { CenarioType, UserContextType, UserType } from "@/utils/types/generalTypes/types";
import type { ReactNode } from "react";

export const UserContext = createContext<UserContextType>({
  user: null,
  cenarios: [],
  setUser: () => {},
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
