import { Dispatch, SetStateAction } from "react";
import { PredRowType } from "../predListTypes";

interface AddRowPropsType {
  newRow: PredRowType;
  setNewRow: Dispatch<SetStateAction<PredRowType>>;
  onlyBack: boolean;
}

export type { AddRowPropsType };
