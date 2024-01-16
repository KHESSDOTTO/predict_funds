import { ReactNode } from "react";

interface SideBarProps {
  showSideBar: boolean;
  setShowSideBar: Function;
}

interface HeaderProps {
  user: UserType;
}

interface ButtonProps {
  children: ReactNode;
}

interface UserType {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  address: string;
  cnpj: string;
  contactPhone: string;
  products: string[]; // Assuming products are represented by their ObjectId
  createdAt: Date;
  emailConfirm: boolean;
  isActive: boolean;
}

interface RawDataType {
  DT_COMPTC: Date;
  CNPJ_FUNDO: string;
  VL_QUOTA: number;
  VL_TOTAL?: number;
  CAPTC_DIA?: number;
  NR_COTST?: number;
  TP_FUNDO: string;
  VL_PATRIM_LIQ?: number;
  RESG_DIA?: number;
  CAPTC_LIQ: number;
}

interface UserContextType {
  user: UserType | null;
  cenarios: CenarioType[];
  setUser: (newUser: UserType | null) => void;
  setCenarios: (newData: CenarioType[]) => void;
}

interface DashboardControlFormType {
  buscaCnpj: string;
  DI: number;
  varCota: number;
  weeksBack: number;
  weeksForward: number;
}

interface CenarioType {
  id: string;
  params: DashboardControlFormType;
  data: RawDataType[];
}

export type {
  ButtonProps,
  UserType,
  RawDataType,
  SideBarProps,
  HeaderProps,
  UserContextType,
  DashboardControlFormType,
  CenarioType,
};
