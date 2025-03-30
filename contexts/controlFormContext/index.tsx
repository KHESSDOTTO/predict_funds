import { createContext, useContext, useState } from "react";
import { DashboardControlFormType } from "@/utils/types/generalTypes/types";
import {
  ControlFormContextType,
  ControlFormProviderProps,
} from "./controlFormContextTypes";
import { consoleLog } from "@/utils/functions/genericFunctions";

const ControlFormContext = createContext<ControlFormContextType | undefined>(
  undefined
);

export function ControlFormProvider({
  children,
  initialAncoras = [],
  initialCnpjs,
}: ControlFormProviderProps) {
  const [controlForm, setControlForm] = useState<DashboardControlFormType>({
    baseDate:
      initialAncoras.length > 0
        ? initialAncoras[initialAncoras.length - 1]
        : "2024-05-31T00:00:00.00Z",
    buscaCnpj: initialCnpjs ? initialCnpjs[0] : "",
    varNF: 0,
    varCotistas: 0,
    varCota: 0,
    weeksBack: 8,
    weeksAhead: 4,
    Classificacao: "",
  });

  return (
    <ControlFormContext.Provider value={{ controlForm, setControlForm }}>
      {children}
    </ControlFormContext.Provider>
  );
}

export function useControlForm() {
  const context = useContext(ControlFormContext);

  if (context === undefined) {
    throw new Error("useControlForm must be used within a ControlFormProvider");
  }

  return context;
}
