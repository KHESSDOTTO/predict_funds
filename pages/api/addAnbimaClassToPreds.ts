import { connect } from "@/database/database.config";
import Predictions4Weeks1Model from "@/database/models/predictions4WeeksModel1";
import Predictions4Weeks2Model from "@/database/models/predictions4WeeksModel2";
import Predictions4Weeks3Model from "@/database/models/predictions4WeeksModel3";
import { NextApiRequest, NextApiResponse } from "next";

// NECESSÁRIO DEFINIR QUAL(IS) MODELO/COLLECTION SERÁ ATUALIZADO

export default async function AddAnbimaClassToPreds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connect();
    let entries = await Predictions4Weeks1Model.aggregate([
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
        Predictions4Weeks1Model.updateOne(
          { _id: doc._id },
          { $set: { CLASSE_ANBIMA: doc.CLASSE_ANBIMA } }
        )
      )
    );

    entries = await Predictions4Weeks2Model.aggregate([
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
        Predictions4Weeks2Model.updateOne(
          { _id: doc._id },
          { $set: { CLASSE_ANBIMA: doc.CLASSE_ANBIMA } }
        )
      )
    );

    entries = await Predictions4Weeks3Model.aggregate([
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
        Predictions4Weeks3Model.updateOne(
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
