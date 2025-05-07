import {
  HistoricType,
  PredictionsType,
} from "@/utils/types/generalTypes/types";

interface AggregateChartsDataType {
  Ações: IndChartDataType;
  Multimercado: IndChartDataType;
  "Renda Fixa": IndChartDataType;
}

interface IndChartDataType {
  historic: HistoricType[];
  prediction: PredictionsType[];
}

export type { AggregateChartsDataType, IndChartDataType };
