import { Dispatch, SetStateAction } from "react";

interface CorrelCardsFormPropsType {
  numMonths: number;
  setNumMonths: Dispatch<SetStateAction<number>>;
}

export type { CorrelCardsFormPropsType };
