import bcrypt from "bcrypt";
import UserModel from "../models/user/userModel";
import { generateToken } from "../../utils/jwt.config";
import { serialize } from "cookie";
import transporter from "@/utils/transporter.config";
import { v4 as uuidv4 } from "uuid";

// Cria um novo changeId e insere no usuário indicado
async function insertUpdateChangeId(userId: string) {
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
}

// Obter cnpj do cliente pelo id
async function getUserCnpjById(userId: string) {
  try {
    const user = await UserModel.findById(userId);
    const cnpj: string = user._doc.cnpj;
    return cnpj;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Enviar email de confirmação da conta/email
async function sendConfirmEmail(userId: string, email: string) {
  // console.log(transporter);
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

// Envia e-mail de alteração de senha
async function sendPwdUpdateEmail(userId: string, changeId: string) {
  // console.log(transporter);
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return false;
    }
    // console.log(user);
    // console.log(user._doc);
    const { email, cnpj } = user;
    // console.log(email);
    // console.log(cnpj);
    transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: `Change password - CNPJ: ${cnpj} - PREDICT FUNDS`,
      html: `<p>Click here to change your password:<p> <a href=${
        process.env.NODE_ENV == "development"
          ? `http://localhost:3000/pwd-change/${userId}/${changeId}`
          : `https://predict-funds.vercel.app/pwd-change/${userId}/${changeId}`
      }>CLICK HERE</a>`,
    });
    console.log("E-mail sent!");
  } catch (err) {
    console.log(err);
    return false;
  }
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
  cnpjs: string[];
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

// Edita informações do usuário com exceção da senha
async function doUpdateUserInfoNoPwd(
  userId: string,
  clientInfo: {
    username: string;
    email: string;
    cnpj: string;
    address: string;
    contactPhone: string;
    pwd?: string;
  }
) {
  // console.log("clientInfo");
  // console.log(clientInfo);
  try {
    if (clientInfo.pwd && clientInfo.pwd !== "") {
      const user = await UserModel.findOne({ username: clientInfo.username });
      if (!user) {
        return { ok: false, status: 500, msg: "User not found." };
      }
      const match = await bcrypt.compare(clientInfo.pwd, user.passwordHash);
      if (!match) {
        return { ok: false, status: 500, msg: "Passwords didn't match." };
      }
    }
    delete clientInfo.pwd;
    const updUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        ...clientInfo,
      },
      {
        new: true,
      }
    );
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
}

// Edita a senha do usuário (editar ou "Esqueceu sua senha")
async function doUpdateUserPwd(
  userId: string,
  changeId: string,
  newPwdForm: {
    newPwd: string;
    confirmNewPwd: string;
  }
) {
  const { newPwd, confirmNewPwd } = newPwdForm;
  try {
    const user = await UserModel.findById(userId);

    if (changeId !== user.changeId) {
      return { ok: false, status: 500, msg: "Wrong changeId." };
    }

    if (
      !newPwd ||
      !newPwd.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      ) ||
      newPwd !== confirmNewPwd
    ) {
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
}

export {
  insertUpdateChangeId,
  doCreateUser,
  doLogin,
  doConfirmEmail,
  doUpdateUserInfoNoPwd,
  doUpdateUserPwd,
  sendPwdUpdateEmail,
  getUserCnpjById,
};
