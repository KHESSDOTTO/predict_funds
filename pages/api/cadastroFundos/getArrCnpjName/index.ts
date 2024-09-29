import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import { getArrCnpjName } from "@/database/functions/cadastroFundosFunctions";
import { consoleLog } from "@/functions/functions";

async function GetArrCnpjName(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).send("Only POST method accepted at this endpoint.");
  }
  console.log("cnpjs API");
  console.log(req.body.cnpjs);
  if (
    !req.body ||
    (req.body && (!req.body.cnpjs || !Array.isArray(req.body.cnpjs)))
  ) {
    return res
      .status(400)
      .send("No CNPJ list or wrong format of it was sent as argument.");
  }
  try {
    await connect();
    const { cnpjs } = req.body;
    const arrCnpjName = await getArrCnpjName(cnpjs);
    if (!arrCnpjName) {
      return res
        .status(204)
        .json({ msg: "No CNPJ found ('false' was returned)" });
    }
    return res.status(200).json(arrCnpjName);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
}

export default GetArrCnpjName;
