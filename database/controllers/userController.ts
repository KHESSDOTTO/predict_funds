import bcrypt from "bcrypt";
import UserModel from "../models/userModel";

// Signup
async function createUser(clientInfo: {
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
    console.log(
      "Error occured. Either password and password confirm didn't match, or there is no password, \
or password didn't match the required format"
    );
    return false;
  }
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = await UserModel.create({
      ...clientInfo,
      passwordHash: hashedPassword,
    });
    delete createdUser._doc.passwordHash;
    return createdUser;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { createUser };
