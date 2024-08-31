import { ReactNode } from "react";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface SideBarPropsType {
  showSideBar: boolean;
  setShowSideBar: Function;
}

interface HeaderPropsType {
  user: UserType;
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
  DT_COMPTC?: Date;
  CNPJ_FUNDO: string;
  [key: string]: string | number | Date | undefined; // Adjust the index signature to accommodate both types
}

interface ConfidenceIntervalType {
  CNPJ_FUNDO: string;
  mean: number;
  std: number;
  CI90: number;
  CI95: number;
  CI99: number;
  ancora: Date;
  datahora_calc_residual_abs: Date;
  [key: string]: string | number | Date; // Adjust the index signature to accommodate both types
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

interface HistoricType {
  DT_COMPTC: Date;
  CNPJ_FUNDO: string;
  VL_QUOTA_ms: number;
  VL_TOTAL_ms?: number;
  NR_COTST_ms?: number;
  VL_PATRIM_LIQ_ms: number;
  CAPTC_DIA_ms: number;
  RESG_DIA_ms: number;
  CAPTC_LIQ_ms?: number;
  CAPTC_LIQ_ABS_ms?: number;
  CAPTC_LIQ_PCT_ms?: number;
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
  anbimaClass: string;
}

interface RawHistogramData {
  CNPJ_FUNDO: string;
  CAPTC_LIQ_ABS_ms: number;
  CAPTC_LIQ_PCT_ms: number;
}

interface FinalHistogramData {
  abs: {
    xTick: string;
    value: number;
    limit: number;
    selCnpjBin: boolean;
  }[];
  pct: {
    xTick: string;
    value: number;
    limit: number;
    selCnpjBin: boolean;
  }[];
}

interface CenarioType {
  id: string;
  params: DashboardControlFormType;
  historicData: HistoricType[];
  predictionData: PredictionsType[];
}

interface CardPropsType {
  title: string;
  imgSrc: string;
  correlVal: number;
}

interface ToneColorsInterface {
  [key: string]: string;
}

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  data?: (HistoricType | PredictionsType)[];
  absOrPct?: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  isMobile?: boolean;
}

interface ChartSectionProps {
  data: HistoricType[];
  smallV: boolean;
  predictions: PredictionsType[];
  loadingHistogram?: boolean;
  histogram?: FinalHistogramData | false;
}

interface CustomCursorProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  stroke?: string;
}

export type {
  ButtonPropsType,
  UserType,
  HistoricType,
  SideBarPropsType,
  HeaderPropsType,
  UserContextType,
  DashboardControlFormType,
  CenarioType,
  PredictionsType,
  ConfidenceIntervalType,
  CadastroFundosType,
  RawHistogramData,
  FinalHistogramData,
  CardPropsType,
  ToneColorsInterface,
  CustomTooltipProps,
  ChartSectionProps,
  CustomCursorProps,
};
