import HistoricModel from "../models/historicModel";

async function getAllHistoricByCnpj(cnpj: string, baseDate: string) {
  try {
    console.log("baseDate");
    console.log(baseDate);

    const allHistoric = await HistoricModel.find({
      CNPJ_FUNDO: cnpj,
      DT_COMPTC: { $lte: new Date(baseDate) },
    });

    // Fixing manually UTC date. In database, GMT-3 data was stored as if they were UTC so it is necessary to add 3 hours to each date.
    const finalResult = allHistoric.map((cE) => {
      // Rename fields ending with "_ms"
      const renamedDoc: any = {};
      for (const key in cE._doc) {
        if (key.endsWith("_ms")) {
          const newKey = key.slice(0, -3);
          renamedDoc[newKey] = cE._doc[key];
        } else {
          renamedDoc[key] = cE._doc[key];
        }
      }

      // Update the document with the renamed fields
      cE._doc = renamedDoc;

      return cE;
    });

    // console.log("lastPred");
    // console.log(finalResult.findLast(() => true));

    return finalResult;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { getAllHistoricByCnpj };
