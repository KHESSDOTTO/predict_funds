import { UserType } from "@/utils/types/generalTypes/types";
import { Dispatch, SetStateAction } from "react";

interface ProfilePagePropsType {
  user: UserType;
}

interface HandleSubmitOutsideParamsType {
  user: UserType;
  form: ProfileFormType;
  formRef: React.RefObject<HTMLFormElement>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleSubmitNoEmail: (params: HandleSubmitNoEmailParamsType) => Promise<void>;
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
  handleSubmitNoEmail: (params: HandleSubmitNoEmailParamsType) => Promise<void>;
}

interface HandleSubmitNoEmailParamsType {
  e: React.FormEvent<HTMLFormElement>;
  user: UserType;
  form: ProfileFormType;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

interface DoSubmitEmailChangeParamsType {
  e: React.FormEvent<HTMLFormElement>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  form: ProfileFormType;
  user: UserType;
}

interface HandleChangePwdParamsType {
  user: UserType;
}

export type {
  ProfilePagePropsType,
  HandleSubmitOutsideParamsType,
  ProfileFormType,
  ProfileFormPropsType,
  HandleSubmitNoEmailParamsType,
  DoSubmitEmailChangeParamsType,
  HandleChangePwdParamsType,
};
