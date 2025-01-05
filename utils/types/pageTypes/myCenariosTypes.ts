import type { CenarioType, UserType } from "@/utils/types/generalTypes/types";
import type { Dispatch, RefObject, SetStateAction } from "react";

interface MyCenariosPagePropsType {
  userFromToken: UserType;
}

interface ExcludeCenarioParamsType {
  cenarioId: string;
  cenarios: CenarioType[];
  setCenarios: (newData: CenarioType[]) => void;
}

interface ExportCenariosParamsType {
  cenarios: CenarioType[];
}

export type {
  MyCenariosPagePropsType,
  ExcludeCenarioParamsType,
  ExportCenariosParamsType,
};
