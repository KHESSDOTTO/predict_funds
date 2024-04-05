import { ReactNode } from "react";

interface SideBarPropsType {
  showSideBar: boolean;
  setShowSideBar: Function;
}

interface CadastroFundosType {
  CNPJ_FUNDO: string;
  TP_FUNDO: string;
  DENOM_SOCIAL: string;
  DT_REG: string;
  DT_CONST: string;
  CD_CVM: number;
  DT_CANCEL: string;
  SIT: string;
  DT_INI_SIT: string;
  DT_INI_ATIV: string;
  DT_INI_EXERC: string;
  DT_FIM_EXERC: string;
  CLASSE: string;
  DT_INI_CLASSE: string;
  RENTAB_FUNDO: string;
  CONDOM: string;
  FUNDO_COTAS: string;
  FUNDO_EXCLUSIVO: string;
  TRIB_LPRAZO: string;
  PUBLICO_ALVO: string;
  ENTID_INVEST: string;
  TAXA_PERFM: number;
  INF_TAXA_PERFM: string;
  TAXA_ADM: number;
  INF_TAXA_ADM: string;
  VL_PATRIM_LIQ: number;
  DT_PATRIM_LIQ: string;
  DIRETOR: string;
  CNPJ_ADMIN: string;
  ADMIN: string;
  PF_PJ_GESTOR: string;
  CPF_CNPJ_GESTOR: string;
  GESTOR: string;
  CNPJ_AUDITOR: string;
  AUDITOR: string;
  CNPJ_CUSTODIANTE: string;
  CUSTODIANTE: string;
  CNPJ_CONTROLADOR: string;
  CONTROLADOR: string;
  INVEST_CEMPR_EXTER: string;
  CLASSE_ANBIMA: string;
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
  shadowSize: string;
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
  cnpjs: string[];
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
  baseDate: string;
  buscaCnpj: string;
  varNF: number;
  varCotistas: number;
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
  CadastroFundosType,
};
