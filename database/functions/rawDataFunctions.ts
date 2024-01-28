import RawDataModel from "@/database/models/rawDataModel";

async function GetAllRawDataFromCnpj(cnpj: string) {
  const allRawData = await RawDataModel.find({
    CNPJ_FUNDO: cnpj,
  });
  return allRawData;
}

export { GetAllRawDataFromCnpj };
