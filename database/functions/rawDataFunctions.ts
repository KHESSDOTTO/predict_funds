import RawDataModel from "@/database/models/rawDataModel";
import { addHours } from "date-fns";

async function GetAllRawDataFromCnpj(cnpj: string) {
  try {
    const allRawData = await RawDataModel.find({
      CNPJ_FUNDO: cnpj,
      DT_COMPTC: { $lte: new Date("2023-12-15T03:00:00Z") },
    });
    // Fixing manually UTC date. In database, GMT-3 data was stored as if they were UTC so it is necessary to add 3 hours to each date.
    const finalResult = allRawData.map((cE) => {
      cE._doc = { ...cE._doc, DT_COMPTC: addHours(cE._doc.DT_COMPTC, 3) };
      return cE;
    });
    console.log("finalResult");
    console.log(finalResult);
    return finalResult;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { GetAllRawDataFromCnpj };
