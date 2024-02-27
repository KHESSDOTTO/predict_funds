import RawDataModel from "@/database/models/rawDataModel";

async function GetAllRawDataFromCnpj(cnpj: string) {
  try {
    const allRawData = await RawDataModel.find({
      CNPJ_FUNDO: cnpj,
    });
    return allRawData;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export { GetAllRawDataFromCnpj };
