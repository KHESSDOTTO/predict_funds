import { ReactNode } from "react";
import { UserType } from "@/utils/types/generalTypes/types";

interface AppProviderProps {
  children: ReactNode;
  initialAncoras?: string[];
  user?: UserType;
}

export type {
  AppProviderProps
}
