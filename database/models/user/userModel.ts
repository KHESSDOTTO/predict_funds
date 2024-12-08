import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/jwt.config";
import { serialize } from "cookie";
import transporter from "@/utils/transporter.config";
import { v4 as uuidv4 } from "uuid";
import {
  UserModelDocType,
  UserModelType,
  ClientInfoUpdateUserInfoNoPwd,
  CreateUserInfoType,
  GenericObjectReturnType,
} from "./userType";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    passwordHash: { type: String, required: true },
    address: { type: String, rerquired: true, trim: true },
    cnpj: {
      type: String,
      trim: true,
      match: /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/gm,
      unique: true,
      sparse: true,
      required: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      match: /^[0-9]{11,13}$/gm,
      unique: false,
      required: true,
    },
    cnpjs: [
      {
        type: String,
        trim: true,
        match: /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/gm,
        unique: false,
        sparse: true,
        required: true,
      },
    ],
    changeId: { type: String, required: false, unique: false },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    emailConfirm: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, required: true },
  },
  { timestamps: true }
);

// Creates a new changeId and inserts it in the indicated user
UserSchema.statics.insertUpdateChangeId = async function (userId: string) {
  try {
    const newChangeId = uuidv4();
    const updUser = UserModel.findByIdAndUpdate(
      userId,
      {
        changeId: newChangeId,
      },
      {
        new: true,
      }
    );
    return updUser;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Get CNPJ by Id
UserSchema.statics.getUserCnpjById = async function (userId: string) {
  try {
    const user = await UserModel.findById(userId).lean().exec();

    if (user) {
      return user.cnpj;
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Send e-mail confirmation
UserSchema.statics.sendConfirmEmail = async function (
  userId: string,
  email: string
) {
  transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Confirm Your E-mail - PREDICT FUNDS",
    html: `<p>Click here to activate your account:<p> <a href="${ process.env.NEXT_PUBLIC_BASE_API_URL }/user/account-confirm/${ userId }">CLICK HERE</a>`,
  });
};

// Send password change e-mail
UserSchema.statics.sendPwdUpdateEmail = async function (
  userId: string,
  changeId: string
) {
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return false;
    }

    const { email, cnpj } = user;

    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: `Change password - CNPJ: ${cnpj} - PREDICT FUNDS`,
      html: `<p>Click here to change your password:<p> <a href="${ process.env.NEXT_PUBLIC_BASE_URL }/pwd-change/${ userId }/${ changeId }">CLICK HERE</a>`,
    });

    console.log("E-mail sent!");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Signup
UserSchema.statics.doCreateUser = async function (
  clientInfo: CreateUserInfoType
) {
  const SALT_ROUNDS = 10;
  const { password, passwordConfirm } = clientInfo;
  if (
    !password ||
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
    ) ||
    password !== passwordConfirm
  ) {
    return {
      ok: false,
      status: 500,
      msg: "Error occured. Either password and password confirm didn't match, or there is no password, \
or password didn't match the required format",
    };
  }
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUserOriginal = await UserModel.create({
      ...clientInfo,
      passwordHash: hashedPassword,
    });

    const createdUser = createdUserOriginal.toObject();

    UserModel.sendConfirmEmail(String(createdUser._id), createdUser.email);

    delete createdUser.passwordHash;
    delete createdUser._id;

    return {
      ok: true,
      status: 200,
      msg: createdUser,
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      msg: err,
    };
  }
};

// Login
UserSchema.statics.doLogin = async function (clientInfo: {
  username: string;
  password: string | Buffer;
}): Promise<GenericObjectReturnType> {
  try {
    const { username, password } = clientInfo;
    const user = await UserModel.findOne({
      username: username,
    })
      .lean()
      .exec();

    if (!user) {
      return {
        ok: false,
        status: 500,
        msg: "User not found.",
      };
    }

    if (!user.emailConfirm) {
      return {
        ok: false,
        status: 500,
        msg: "Account not yet confirmed.",
      };
    }

    if (
      user.passwordHash &&
      user._id &&
      (await bcrypt.compare(password, user.passwordHash))
    ) {
      const token = generateToken(user);
      const authCookie = serialize("loggedInUser", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 12,
        path: "/",
      });
      delete user.passwordHash;
      return {
        ok: true,
        status: 200,
        msg: { ...user },
        token: token,
        authCookie: authCookie,
      };
    } else {
      return {
        ok: false,
        status: 500,
        msg: "Informations don't match",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      msg: err,
    };
  }
};

// Confirma email da conta - ativar conta
UserSchema.statics.doConfirmEmail = async function (userId: string) {
  try {
    const user = await UserModel.findById(userId).exec();

    if (!user) {
      return {
        ok: false,
        status: 500,
        msg: "Couldn't confirm e-mail. Try again.",
      };
    }

    await UserModel.findByIdAndUpdate(userId, { emailConfirm: true });
    return {
      ok: true,
      status: 200,
      msg: "Account confirmed!",
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      msg: `Error: ${err}`,
    };
  }
};

// Update user without changing password
UserSchema.statics.doUpdateUserInfoNoPwd = async function (
  userId: string,
  clientInfo: ClientInfoUpdateUserInfoNoPwd
) {
  try {
    if (clientInfo.pwd && clientInfo.pwd !== "") {
      const user = (await UserModel.findOne({
        username: clientInfo.username,
      })
        .lean()
        .exec()) as UserModelDocType;

      if (!user) {
        return { ok: false, status: 500, msg: "User not found." };
      }

      if (!user.passwordHash) {
        return {
          ok: false,
          status: 500,
          msg: "There is an error with the user document.",
        };
      }

      const match = await bcrypt.compare(clientInfo.pwd, user.passwordHash);

      if (!match) {
        return { ok: false, status: 500, msg: "Passwords didn't match." };
      }
    }
    delete clientInfo.pwd;

    const updUser = (await UserModel.findByIdAndUpdate(
      userId,
      {
        ...clientInfo,
      },
      {
        new: true,
      }
    )
      .lean()
      .exec()) as UserModelDocType;

    const token = generateToken(updUser);
    const authCookie = serialize("loggedInUser", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 12,
      path: "/",
    });
    return {
      ok: true,
      status: 200,
      msg: updUser,
      token: token,
      authCookie: authCookie,
    };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 500, msg: err };
  }
};

// Update user's password only
UserSchema.statics.doUpdateUserPwd = async function (
  userId: string,
  changeId: string,
  newPwdForm: {
    newPwd: string;
    confirmNewPwd: string;
  }
): Promise<GenericObjectReturnType> {
  const { newPwd, confirmNewPwd } = newPwdForm;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return { ok: false, status: 500, msg: "User not found." };
    }

    if (changeId !== user.changeId) {
      return { ok: false, status: 500, msg: "Wrong changeId." };
    }

    const pwdValidation =
      newPwd &&
      newPwd.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      ) &&
      newPwd === confirmNewPwd
    ;

    if (!pwdValidation) {
      return {
        ok: false,
        status: 500,
        msg: "Error occured. Either password and password confirm didn't match, or there is no password, \
or password didn't match the required format.",
      };
    }

    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPwd, salt);

    const done = await UserModel.findByIdAndUpdate(userId, {
      passwordHash: hashedPassword,
      changeId: "",
    });

    if (!done) {
      return { ok: false, status: 500, msg: "Something went wrong." };
    }

    const token = generateToken(user);
    const authCookie = serialize("loggedInUser", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 12,
      path: "/",
    });

    return {
      ok: true,
      status: 200,
      msg: "Password updated.",
      token: token,
      authCookie: authCookie,
    };
  } catch (err) {
    return { ok: false, status: 500, msg: err };
  }
};

const UserModel =
  (models.User as UserModelType) ||
  model<UserModelDocType, UserModelType>("User", UserSchema, "users");

export default UserModel;
