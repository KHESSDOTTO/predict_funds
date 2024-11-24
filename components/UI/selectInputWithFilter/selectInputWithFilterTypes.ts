import {
  Dispatch,
  SetStateAction
} from "react";

interface SelectWithFilterProps {
  options: string[];
  value: string;
  varNameForm: string;
  setForm: Dispatch<SetStateAction<any>>;
  placeholder?: string;
}

export type {
  SelectWithFilterProps
}
