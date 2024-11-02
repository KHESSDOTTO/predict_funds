import { AbsOrPctType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

interface AbsOrPctHistogramViewFormPropsType {
  absOrPct: AbsOrPctType;
  setAbsOrPct: Dispatch<SetStateAction<AbsOrPctType>>;
}

export type { AbsOrPctHistogramViewFormPropsType };
