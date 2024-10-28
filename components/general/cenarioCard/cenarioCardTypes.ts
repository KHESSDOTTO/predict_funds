import { CenarioType } from "@/utils/types";

interface CenarioCardPropsType {
  cenarioData: CenarioType;
  index: number;
  excludeCenarioFunction(cenarioId: string): void;
}

export type { CenarioCardPropsType };
