import { UserType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

interface ProfilePagePropsType {
  user: UserType;
}

interface HandleSubmitOutsideArgsType {
  user: UserType;
  form: ProfileFormType;
  formRef: React.RefObject<HTMLFormElement>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleSubmitNoEmail: (params: HandleSubmitNoEmailArgsType) => Promise<void>;
}

interface ProfileFormType {
  username: string;
  cnpj: string;
  email: string;
  contactPhone: string;
  address: string;
}

interface ProfileFormPropsType {
  user: UserType;
  formRef: React.RefObject<HTMLFormElement>;
  form: ProfileFormType;
  setForm: Dispatch<SetStateAction<ProfileFormType>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleSubmitNoEmail: (params: HandleSubmitNoEmailArgsType) => Promise<void>;
}

interface HandleSubmitNoEmailArgsType {
  e: React.FormEvent<HTMLFormElement>;
  user: UserType;
  form: ProfileFormType;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

interface DoSubmitEmailChangeArgsType {
  e: React.FormEvent<HTMLFormElement>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  form: ProfileFormType;
  user: UserType;
}

interface HandleChangePwdArgsType {
  user: UserType;
}

export type {
  ProfilePagePropsType,
  HandleSubmitOutsideArgsType,
  ProfileFormType,
  ProfileFormPropsType,
  HandleSubmitNoEmailArgsType,
  DoSubmitEmailChangeArgsType,
  HandleChangePwdArgsType,
};
