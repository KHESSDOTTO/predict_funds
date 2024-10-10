import { Document, Model, Schema } from "mongoose";

// Interface for the mongoose document Here should also go custom properties and instance methods
export interface UserModelDocType extends Document {
  username: string;
  email: string;
  passwordHash?: string;
  address: string;
  cnpj: string;
  contactPhone: string;
  cnpjs: string[];
  changeId: string;
  products: Schema.Types.ObjectId[];
  emailConfirm: boolean;
  isActive: boolean;
  createdAt: Date;
}

// Interface for the model itself, custom static methods should go in here
export interface UserModelType extends Model<UserModelDocType> {
  insertUpdateChangeId(userId: string): Promise<any>;
  getUserCnpjById(userId: string): Promise<string | false>;
  sendConfirmEmail(userId: string, email: string): Promise<void>;
  sendPwdUpdateEmail(userId: string, changeId: string): Promise<boolean>;
  doCreateUser(
    clientInfo: CreateUserInfoType
  ): Promise<{ ok: boolean; status: number; msg: any }>;
  doLogin(clientInfo: LoginUserInfoType): Promise<GenericObjectReturnType>;
  doConfirmEmail(userId: string): Promise<{
    ok: boolean;
    status: number;
    msg: string;
  }>;
  doUpdateUserInfoNoPwd(
    userId: string,
    clientInfo: ClientInfoUpdateUserInfoNoPwd
  ): Promise<GenericObjectReturnType>;
  doUpdateUserPwd(
    userId: string,
    changeId: string,
    newPwdForm: NewPwdFormType
  ): Promise<GenericObjectReturnType>;
}

// Interfaces for specific types related to the model and its methods
export interface CreateUserInfoType {
  username: string;
  email: string;
  cnpj: string;
  address: string;
  password: string;
  contactPhone: string;
  passwordConfirm: string;
  cnpjs: string[];
}

export interface LoginUserInfoType {
  username: string;
  password: string | Buffer;
}

export interface NewPwdFormType {
  newPwd: string;
  confirmNewPwd: string;
}

export interface ClientInfoUpdateUserInfoNoPwd {
  username: string;
  email: string;
  cnpj: string;
  address: string;
  contactPhone: string;
  pwd?: string;
}

export type GenericObjectReturnType =
  | {
      ok: false;
      status: number;
      msg: unknown;
    }
  | {
      ok: true;
      status: number;
      msg: object | string;
      token: string;
      authCookie: string;
    };
