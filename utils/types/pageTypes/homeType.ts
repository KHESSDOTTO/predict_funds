import { UserType } from "@/utils/types/generalTypes/types";

interface LoggedInHomePropsType {
  user: UserType;
  ancoras: string[] | null;
}

export type { LoggedInHomePropsType };
