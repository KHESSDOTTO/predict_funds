import { DashboardControlFormType } from "@/utils/types/generalTypes/types";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface ControlFormContextType {
  controlForm: DashboardControlFormType;
  setControlForm: Dispatch<SetStateAction<DashboardControlFormType>>;
}
  
interface ControlFormProviderProps {
  children: ReactNode;
  initialAncoras?: string[];
  initialCnpjs?: string[];
}

export type {
    ControlFormContextType,
    ControlFormProviderProps,
}
