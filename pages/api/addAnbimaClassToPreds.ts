import { connect } from "@/database/database.config";
import PredictionsModel from "@/database/models/predictionsModel";
import { NextApiRequest, NextApiResponse } from "next";

// NECESSÁRIO DEFINIR QUAL(IS) MODELO/COLLECTION SERÁ ATUALIZADO

export default async function AddAnbimaClassToPreds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();
    let entries = await PredictionsModel.aggregate([
      {
        $lookup: {
          from: "cadastro_fundos",
          localField: "CNPJ_FUNDO",
          foreignField: "CNPJ_FUNDO",
          as: "fundosDetails",
        },
      },
      {
        $unwind: "$fundosDetails",
      },
      {
        $project: {
          _id: 1,
          CLASSE_ANBIMA: "$fundosDetails.CLASSE_ANBIMA",
        },
      },
    ]);

    // Ensuring all updates complete before responding
    await Promise.all(
      entries.map((doc) =>
        PredictionsModel.updateOne(
          { _id: doc._id },
          { $set: { CLASSE_ANBIMA: doc.CLASSE_ANBIMA } }
        )
      )
    );

    return res.status(200).json({ status: 200, message: "Updated!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, message: err });
  }
}
