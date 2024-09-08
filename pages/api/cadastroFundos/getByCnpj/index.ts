import type { NextApiRequest, NextApiResponse } from "next";
import { connect } from "@/database/database.config";
import { getCadastroByCnpj } from "@/database/functions/cadastroFundosFunctions";

async function GetByCnpj(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).send("Only GET method accepted at this endpoint.");
  }
  if (!req.query || (req.query && !req.query.cnpj)) {
    return res.status(400).send("No CNPJ was sent as argument.");
  }
  if (typeof req.query.cnpj !== "string") {
    return res.status(400).send("CNPJ sent in the URL is not valid.");
  }
  try {
    await connect();
    const cadastro = await getCadastroByCnpj(req.query.cnpj);
    if (!cadastro) {
      return res.status(204).send("");
    }
    return res.status(200).json(cadastro);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
}

export default GetByCnpj;
