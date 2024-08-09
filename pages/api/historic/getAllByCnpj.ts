import type { NextApiRequest, NextApiResponse } from "next";
import { getAllHistoricByCnpj } from "@/database/functions/historicFunctions";
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

    const response = await getAllHistoricByCnpj(
      req.query.cnpj,
      req.query.baseDate
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
