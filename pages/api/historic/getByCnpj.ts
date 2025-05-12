import type { NextApiRequest, NextApiResponse } from "next";
import HistoricModel from "@/database/models/historic/historicModel";
import { connect } from "@/database/database.config";

async function GetHistoricByCnpj(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(400)
      .json({ msg: "Only GET methos accepted on this endpoint" });
  }

  try {
    await connect();

    let selHistoric = [];

    if (
      typeof req.query.cnpj !== "string" ||
      typeof req.query.baseDate !== "string"
    ) {
      return res
        .status(400)
        .json({ msg: "Wrong CNPJ or basedate (not string)" });
    }

    const { cnpj, baseDate, weeksBack } = req.query;
    const numWeeksBack = Number(weeksBack);
    const formattedBaseDate = new Date(baseDate);

    const response = await HistoricModel.getHistoricByCnpj(
      cnpj,
      formattedBaseDate,
      numWeeksBack
    );

    if (!response) {
      return res
        .status(500)
        .json(
          `No data found for CNPJ: ${req.query.cnpj} on baseDate: ${req.query.baseDate}`
        );
    }

    selHistoric = response;

    return res.status(200).json(selHistoric);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: err });
  }
}

export default GetHistoricByCnpj;
