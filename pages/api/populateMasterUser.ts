import { connect } from "@/database/database.config";
import PredictionModel from "@/database/models/predictionModel";
import UserModel from "@/database/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function PopulateMasterUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();
    const allCnpjsPredicted = await PredictionModel.find(
      {},
      { CNPJ_FUNDO: 1, _id: 0 }
    );
    const masterUser = await UserModel.findOne({ username: "master" });
    let newCnpjs = [masterUser.cnpj].concat(
      Object.values(allCnpjsPredicted.slice(0, 50))
    );
    newCnpjs = newCnpjs.map((cE: string | { CNPJ_FUNDO: string }) => {
      if (typeof cE === "string") return cE;
      return cE.CNPJ_FUNDO;
    });
    const newMasterUser = await UserModel.findOneAndUpdate(
      { username: "master" },
      { cnpjs: newCnpjs },
      { new: true }
    );
    return res.status(200).json({ status: 200, message: newMasterUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, message: err });
  }
}
