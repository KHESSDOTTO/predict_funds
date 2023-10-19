import bcrypt from "bcrypt";
import UserModel from "../models/userModel";
import { generateToken } from "../../utils/jwt.config";
import { serialize } from "cookie";
import transporter from "@/utils/transporter.config";

async function sendConfirmEmail(userId: string, email: string) {
  transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Confirm Your E-mail - PREDICT FUNDS",
    html: `<p>Click here to activate your account:<p> <a href=${
      process.env.NODE_ENV == "development"
        ? "http://localhost:3000/api/user/account-confirm"
        : "https://predict-funds.vercel.app/api/user/account-confirm"
    }/${userId}>CLICK HERE</a>`,
  });
}

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
    sendConfirmEmail(createdUser._doc._id, createdUser._doc.email);
    delete createdUser._doc.passwordHash;
    delete createdUser._doc._id;
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
    if (!user.emailConfirm) {
      return {
        ok: false,
        status: 500,
        msg: "Account not yet confirmed.",
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

// Confirma email da conta - ativar conta
async function doConfirmEmail(userId: string) {
  try {
    const user = await UserModel.findOne({ _id: userId });
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
}

export { doCreateUser, doLogin, doConfirmEmail };
