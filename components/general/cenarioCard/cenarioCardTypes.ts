import { ExcludeCenarioParamsType } from "@/pages/loggedin/my_cenarios/myCenariosTypes";
import { CenarioType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

interface CenarioCardPropsType {
  cenarios: CenarioType[];
  setCenarios: (newData: CenarioType[]) => void;
  cenarioData: CenarioType;
  index: number;
  excludeCenarioFunction(params: ExcludeCenarioParamsType): void;
}

interface HandleFadeOutParamsType {
  id: string;
  cenarios: CenarioType[];
  setCenarios: (newData: CenarioType[]) => void;
  setIsFadingOut: Dispatch<SetStateAction<boolean>>;
  excludeCenarioFunction(params: ExcludeCenarioParamsType): void;
}

export type { CenarioCardPropsType, HandleFadeOutParamsType };
