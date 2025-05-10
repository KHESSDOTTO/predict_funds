import type { NextApiRequest, NextApiResponse } from "next";
import HistoricModel from "@/database/models/historic/historicModel";
import { connect } from "@/database/database.config";

async function GetAllHistoric(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(400)
      .json({ msg: "Only GET methos accepted on this endpoint" });
  }

  try {
    await connect();

    let allRawData = [];

    if (
      typeof req.query.cnpj !== "string" ||
      typeof req.query.baseDate !== "string"
    ) {
      return res
        .status(400)
        .json({ msg: "Wrong CNPJ or basedate (not string)" });
    }

    const { cnpj, baseDate } = req.query;
    const formattedBaseDate = new Date(baseDate);

    const response = await HistoricModel.getAllHistoricByCnpj(
      cnpj,
      formattedBaseDate
    );

    if (!response) {
      return res
        .status(500)
        .json(
          `No data found for CNPJ: ${req.query.cnpj} on baseDate: ${req.query.baseDate}`
        );
    }

    allRawData = response;

    return res.status(200).json(allRawData);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: err });
  }
}

export default GetAllHistoric;
