import { createContext, useState, useContext } from "react";
import type { RawDataType, UserContextType, UserType } from "@/utils/types";
import type { ReactNode } from "react";

export const UserContext = createContext<UserContextType>({
  user: null,
  cenarios: [],
  setUser: () => {},
  setCenarios: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [cenarios, setCenarios] = useState<RawDataType[]>([]);
  return (
    <UserContext.Provider value={{ user, cenarios, setUser, setCenarios }}>
      {children}
    </UserContext.Provider>
  );
}
