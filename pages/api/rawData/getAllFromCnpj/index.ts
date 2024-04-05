import type { NextApiRequest, NextApiResponse } from "next";
import { GetAllRawDataFromCnpj } from "@/database/functions/rawDataFunctions";
import { connect } from "@/database/database.config";
import { verifyToken } from "@/utils/jwt.config";

async function GetAllRawData(req: NextApiRequest, res: NextApiResponse) {
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
            let allRawData = [];
            if (typeof req.query.cnpj == "string") {
              const response = await GetAllRawDataFromCnpj(
                req.query.cnpj,
                req.query.baseDate
              );
              if (!response) {
                return res
                  .status(500)
                  .json(`No data found for CNPJ: ${req.query.cnpj}`);
              }
              allRawData = response;
            }
            // console.log(allRawData);
            // await disconnect();
            return res.status(200).json(allRawData);
          }
          // await disconnect();
          return res.status(500).json({ message: "Something went wrong." });
        }
        // await disconnect();
        return res.status(500).json({ message: "No logged in user." });
      }
    } catch (err) {
      console.error(err);
      // await disconnect();
      return res.status(500).json({ error: err });
    }
  }
  return res.status(400).send("Only GET method accepted at this endpoint.");
}

export default GetAllRawData;
