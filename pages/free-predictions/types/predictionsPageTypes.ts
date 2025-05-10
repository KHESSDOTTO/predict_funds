import {
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";

interface FreePredictionsPropsType {
  ancoras: string[];
}

interface AggregateChartsDataType {
  Ações: IndChartDataType;
  Multimercado: IndChartDataType;
  "Renda Fixa": IndChartDataType;
}

interface IndChartDataType {
  historic: HistoricType[];
  prediction: PredictionsType[];
}

interface LoggedOutPredsControlFormType {
  weeksAhead: number;
  weeksBack: number;
  baseDate: string;
}

interface FetchDataParamsType {
  controlForm: LoggedOutPredsControlFormType;
  chartsData: AggregateChartsDataType;
  setChartsData: Dispatch<SetStateAction<AggregateChartsDataType>>;
}

interface FetchHistPredsParamsType {
  dataName: string;
  controlForm: LoggedOutPredsControlFormType;
  dataObj: AggregateChartsDataType;
}

export type {
  FreePredictionsPropsType,
  AggregateChartsDataType,
  IndChartDataType,
  LoggedOutPredsControlFormType,
  FetchDataParamsType,
  FetchHistPredsParamsType,
};
