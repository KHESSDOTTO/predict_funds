import { CenarioType, UserType } from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";

interface UserContextType {
  user: UserType | null;
  cenarios: CenarioType[];
  setUser: Dispatch<SetStateAction<(UserType | null)>>;
  setCenarios: Dispatch<SetStateAction<CenarioType[]>>;
}

export type {
    UserContextType
}
