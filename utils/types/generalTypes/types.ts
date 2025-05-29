import { ReactNode } from "react";
import { TooltipProps } from "recharts";
import { NextRouter } from "next/router";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { UserContextType } from "@/contexts/userContext/userContextTypes";
import { CadastroFundosDocType_doc } from "@/database/models/cadastroFundos/cadastroFundosTypes";
import { UserPreferencesType } from "@/database/models/user/userType";

type AbsOrPctType = "abs" | "pct";

type AbsOrPctNFFieldsType = "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";

interface DoLogoutParamsType {
  userContext: UserContextType;
  router: NextRouter;
}

interface SideBarPropsType {
  showSideBar: boolean;
  setShowSideBar: Function;
}

interface CadastroFundosType extends CadastroFundosDocType_doc {}

interface PredictionsDataObjectType {
  [key: string]: PredictionsType[];
}

interface DashMapType {
  id: number | string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface PredictionsType {
  DT_COMPTC?: Date;
  CNPJ_FUNDO: string;
  CI90_ABS?: number;
  CI95_ABS?: number;
  CI99_ABS?: number;
  CI90_PCT?: number;
  CI95_PCT?: number;
  CI99_PCT?: number;
  CI90_ABS_limits?: number[];
  CI95_ABS_limits?: number[];
  CI99_ABS_limits?: number[];
  CI90_PCT_limits?: number[];
  CI95_PCT_limits?: number[];
  CI99_PCT_limits?: number[];
  mean?: number;
  [key: string]: any; // Adjust the index signature to accommodate both types
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
  preferences?: UserPreferencesType;
}

interface HistoricDataObjectType {
  [key: string]: HistoricType[];
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
  CI_minor?: number | null;
  CI_major?: number | null;
  _id?: string;
  datahora_proc_informes?: string;
  updated_at?: string;
}

interface DashboardControlFormType {
  baseDate: string;
  buscaCnpj: string;
  weeksBack: number;
  weeksAhead: number;
  Classificacao: string;
}

interface HistogramSingleTypeData {
  xTick: string;
  value: number;
  limit: number;
  selCnpjBin: boolean;
  percentile: number;
}

interface FinalHistogramDataType {
  abs: HistogramSingleTypeData[];
  pct: HistogramSingleTypeData[];
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

interface NFTooltipProps extends TooltipProps<ValueType, NameType> {
  data: (HistoricType | PredictionsType)[];
  absOrPct: "CAPTC_LIQ_ABS_ms" | "CAPTC_LIQ_PCT_ms";
  numWeeksPreds: number;
}

export type {
  ButtonPropsType,
  UserType,
  HistoricDataObjectType,
  HistoricType,
  SideBarPropsType,
  DashboardControlFormType,
  CenarioType,
  PredictionsDataObjectType,
  PredictionsType,
  CadastroFundosType,
  HistogramSingleTypeData,
  FinalHistogramDataType,
  CardPropsType,
  ToneColorsInterface,
  NFTooltipProps,
  AbsOrPctType,
  AbsOrPctNFFieldsType,
  DoLogoutParamsType,
  DashMapType,
};
