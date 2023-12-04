import { ReactNode } from "react";

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
  VL_QUOTA?: number; // Use "?" for optional fields
  VL_TOTAL?: number;
  CAPTC_DIA?: number;
  NR_COTST?: number;
  TP_FUNDO: string;
  VL_PATRIM_LIQ?: number;
  RESG_DIA?: number;
  CAPTC_LIQ?: number;
}

export type { ButtonProps, UserType, RawDataType };
