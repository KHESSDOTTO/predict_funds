import { Dispatch, SetStateAction } from "react";

interface HeatMapFormPropsType {
  numMonths: number;
  setNumMonths: Dispatch<SetStateAction<number>>;
}

export type { HeatMapFormPropsType };
