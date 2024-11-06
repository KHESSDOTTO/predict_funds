import { Dispatch, SetStateAction } from "react";

interface CorrelCardsSectionProps {
  padding: string;
  correls: any[];
}

interface SwiperChildrenPropsType {
  cE: any[];
  index: number;
}

interface CorrelCardsFormPropsType {
  numMonths: number;
  setNumMonths: Dispatch<SetStateAction<number>>;
}

export type {
  CorrelCardsSectionProps,
  SwiperChildrenPropsType,
  CorrelCardsFormPropsType,
};
