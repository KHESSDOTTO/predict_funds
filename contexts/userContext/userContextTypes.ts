import { UserType } from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";

interface UserContextType {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
}

export type { UserContextType };
