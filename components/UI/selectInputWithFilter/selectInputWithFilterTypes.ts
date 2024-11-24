import {
  Dispatch,
  MutableRefObject,
  SetStateAction
} from "react";

interface SelectWithFiltersOptionType {
  name: string;
  value: string;
}

interface SelectWithFilterProps {
  options: SelectWithFiltersOptionType[];
  value: string;
  varNameForm: string;
  setForm: Dispatch<SetStateAction<any>>;
  placeholder?: string;
}

interface HandleInputChangeStaticParamsType {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

interface HandleInputChangeParamsType extends HandleInputChangeStaticParamsType {
  e: React.ChangeEvent<HTMLInputElement>;
}

interface HandleOptionClickStaticParamsType {
  varNameForm: string;
  blurTimeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setForm: Dispatch<SetStateAction<any>>;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

interface HandleOptionClickParamsType extends HandleOptionClickStaticParamsType {
  option: SelectWithFiltersOptionType;
}

interface HandleKeyDownStaticParamsType {
  options: SelectWithFiltersOptionType[];
  value: string;
  searchTerm: string;
  varNameForm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
  setForm: Dispatch<SetStateAction<any>>;
}

interface HandleKeyDownParamsType extends HandleKeyDownStaticParamsType {
  e: React.KeyboardEvent<HTMLInputElement>;
}

interface HandleBlurParamsType {
  blurTimeoutRef: MutableRefObject<NodeJS.Timeout | null>;
  searchTerm: string;
  options: SelectWithFiltersOptionType[];
  setSearchTerm: Dispatch<SetStateAction<string>>;
  value: string;
  setForm: Dispatch<SetStateAction<any>>;
  varNameForm: string;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

interface HandleFocusParamsType {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
}

export type {
  SelectWithFilterProps,
  SelectWithFiltersOptionType,
  HandleInputChangeParamsType,
  HandleOptionClickParamsType,
  HandleKeyDownParamsType,
  HandleBlurParamsType,
  HandleFocusParamsType,
  HandleKeyDownStaticParamsType,
  HandleInputChangeStaticParamsType,
  HandleOptionClickStaticParamsType,
}
