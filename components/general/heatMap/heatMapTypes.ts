import { Dispatch, SetStateAction } from "react";

interface CorrelAssocArrType {
  [key: string]: number;
}

interface HeatMapObjType {
  avg: any;
  fund: any;
}

interface HeatMapPropsType {
  title: string;
  heatMapObj: HeatMapObjType | false;
}

interface RowPropsType {
  id: number;
  selCorrels: HeatMapObjType;
}

interface RowDeskPropsType extends RowPropsType {
  name: keyof HeatMapObjType;
  tickers: string[];
}

interface RowMobilePropsType extends RowPropsType {
  ticker: string;
}

interface HeatMapFormPropsType {
  numMonths: number;
  setNumMonths: Dispatch<SetStateAction<number>>;
}

// Types used in functions
interface PrepareHeatMapParamsType {
  heatMapObj: HeatMapObjType;
  exclude: string[];
  numMonths: number;
  setTickers: Dispatch<SetStateAction<string[]>>;
  setSelCorrels: Dispatch<SetStateAction<HeatMapObjType>>;
}

interface ExportHeatMapParams {
  heatMapObj: HeatMapObjType;
}
// End: types used in functions

export type {
  CorrelAssocArrType,
  HeatMapObjType,
  HeatMapPropsType,
  PrepareHeatMapParamsType,
  RowPropsType,
  RowDeskPropsType,
  RowMobilePropsType,
  HeatMapFormPropsType,
  ExportHeatMapParams,
};
