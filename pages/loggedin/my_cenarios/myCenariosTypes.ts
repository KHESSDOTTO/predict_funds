import type { CenarioType, UserType } from "@/utils/types";
import type { Dispatch, RefObject, SetStateAction } from "react";

interface UpdateFooterPositionParamsType {
  footerRef: RefObject<HTMLDivElement>;
  setFooterPosition: Dispatch<SetStateAction<string>>;
}

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
  UpdateFooterPositionParamsType,
  MyCenariosPagePropsType,
  ExcludeCenarioParamsType,
  ExportCenariosParamsType,
};
