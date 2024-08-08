import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import CorrelationsModel from "@/database/models/correlationsModel";

export default async function AddAnbimaClassToPreds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();

    const entries = await CorrelationsModel.aggregate([
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
          CNPJ_FUNDO: 1,
          CLASSE_ANBIMA: "$fundosDetails.CLASSE_ANBIMA",
        },
      },
    ]);

    if (entries.length === 0) {
      return res.status(404).json({ status: 404, message: "No entries found" });
    }

    await Promise.all(
      entries.map((doc) =>
        CorrelationsModel.updateOne(
          { _id: doc._id },
          { $set: { CLASSE_ANBIMA: doc.CLASSE_ANBIMA } }
        )
      )
    );

    return res
      .status(200)
      .json({ status: 200, message: "Updated successfully!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
}
