import bcrypt from "bcrypt";
import UserModel from "../models/userModel";
import { generateToken } from "../jwt.config";
import { serialize, parse } from "cookie";

// Signup
async function doCreateUser(clientInfo: {
  username: string;
  email: string;
  cnpj: string;
  address: string;
  password: string;
  contactPhone: string;
  passwordConfirm: string;
}) {
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
    const createdUser = await UserModel.create({
      ...clientInfo,
      passwordHash: hashedPassword,
    });
    delete createdUser._doc.passwordHash;
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
}

// Login
async function doLogin(clientInfo: {
  username: string;
  password: string | Buffer;
}) {
  try {
    const { username, password } = clientInfo;
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return {
        ok: false,
        status: 500,
        msg: "User not found.",
      };
    }
    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);
      const authCookie = serialize("loggedInUser", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 12,
        path: "/",
      });
      delete user._doc.passwordHash;
      if (!user.emailConfirm) {
        return {
          ok: false,
          status: 500,
          msg: "Account not yet confirmed",
        };
      }
      return {
        ok: true,
        status: 200,
        msg: { ...user._doc },
        token: token,
        authCookie: authCookie,
      };
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      msg: err,
    };
  }
}

export { doCreateUser, doLogin };
