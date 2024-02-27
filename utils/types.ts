import { ReactNode } from "react";

interface SideBarPropsType {
  showSideBar: boolean;
  setShowSideBar: Function;
}

interface PredictionsType {
  _id?: string; // Not present in some parts of code
  DT_COMPTC?: Date; // Not present in mongoDB but necessary in parts of the code
  CNPJ_FUNDO: string;
  "-5.0"?: number;
  "-4.5"?: number;
  "-4.0"?: number;
  "-3.5"?: number;
  "-3.0"?: number;
  "-2.5"?: number;
  "-2.0"?: number;
  "-1.5"?: number;
  "-1.0"?: number;
  "-0.5"?: number;
  "0.0"?: number;
  "0.5"?: number;
  "1.0"?: number;
  "1.5"?: number;
  "2.0"?: number;
  "2.5"?: number;
  "3.0"?: number;
  "3.5"?: number;
  "4.0"?: number;
  "4.5"?: number;
  "5.0"?: number;
  CAPTC_LIQ?: number;
}

interface HeaderPropsType {
  user: UserType;
}

interface ButtonPropsType {
  children: ReactNode;
  shadowColor: string;
}

interface UserType {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  address: string;
  cnpj: string;
  contactPhone: string;
  products: string[];
  changeId: string;
  createdAt: Date;
  emailConfirm: boolean;
  isActive: boolean;
}

interface RawDataType {
  DT_COMPTC: Date;
  CNPJ_FUNDO: string;
  VL_QUOTA: number;
  VL_TOTAL?: number;
  CAPTC_DIA: number;
  NR_COTST?: number;
  TP_FUNDO?: string;
  VL_PATRIM_LIQ: number;
  RESG_DIA: number;
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
  historicData: RawDataType[];
  predictionData: PredictionsType[];
}

export type {
  ButtonPropsType,
  UserType,
  RawDataType,
  SideBarPropsType,
  HeaderPropsType,
  UserContextType,
  DashboardControlFormType,
  CenarioType,
  PredictionsType,
};
