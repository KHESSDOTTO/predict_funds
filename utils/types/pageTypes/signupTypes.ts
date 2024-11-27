import { AxiosInstance } from "axios";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

interface HandleSubmitSignUpParamsType {
  e: React.FormEvent<HTMLFormElement>,
  form: SignUpFormType,
  ax: AxiosInstance,
  router: NextRouter,
}

interface HandleChangeSignUpForm {
  e: React.ChangeEvent<HTMLInputElement>,
  setForm: Dispatch<SetStateAction<SignUpFormType>>,
}

interface SignUpFormType {
  username: string,
  cnpj: string,
  email: string,
  contactPhone: string,
  address: string,
  password: string,
  passwordConfirm: string,
}

export type {
  HandleSubmitSignUpParamsType,
  SignUpFormType,
  HandleChangeSignUpForm
}
