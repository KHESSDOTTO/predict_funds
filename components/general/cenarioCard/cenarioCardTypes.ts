import { CenarioType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

interface CenarioCardPropsType {
  cenarioData: CenarioType;
  index: number;
  excludeCenarioFunction(cenarioId: string): void;
}

interface HandleFadeOutArgsType {
  id: string;
  setIsFadingOut: Dispatch<SetStateAction<boolean>>;
  excludeCenarioFunction(cenarioId: string): void;
}

export type { CenarioCardPropsType, HandleFadeOutArgsType };
