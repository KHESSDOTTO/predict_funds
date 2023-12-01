import type { NextApiRequest, NextApiResponse } from "next";
import { GetAllRawDataFromCnpj } from "@/database/controllers/rawDataController";
import { connect, disconnect } from "@/database/database.config";
import { verifyToken } from "@/utils/jwt.config";

// Busca unicamente por um CNPJ fixo no código. Alterar depois.
async function GetAllRawData(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Method used in request is: ${req.method}`);
  if (req.method === "GET") {
    try {
      await connect();
      if (req.cookies.loggedInUser) {
        const user = verifyToken(req.cookies.loggedInUser);
        if (typeof user === "object") {
          if (user.cnpj) {
            if (!user.formatedCnpj) {
              user["formatedCnpj"] =
                user.cnpj.slice(0, 2) +
                "." +
                user.cnpj.slice(2, 5) +
                "." +
                user.cnpj.slice(5, 8) +
                "/" +
                user.cnpj.slice(8, 12) +
                "-" +
                user.cnpj.slice(12, 14);
            }
            console.log("user.formatedCnpj");
            console.log(user.formatedCnpj);
            const allRawData = await GetAllRawDataFromCnpj(
              "00.089.915/0001-15"
            );
            console.log(allRawData);
            await disconnect();
            return res.status(200).json(allRawData);
          }
          await disconnect();
          return res.status(500).json({ message: "Something went wrong." });
        }
        await disconnect();
        return res.status(500).json({ message: "No logged in user." });
      }
    } catch (err) {
      console.error(err); // Log the error message
      await disconnect();
      return res.status(500).json({ error: err });
    }
  }
  return res.status(400).send("Only GET method accepted at this endpoint.");
}

export default GetAllRawData;
