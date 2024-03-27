import { CadastroFundosType } from "@/utils/types";
import { ClipLoader } from "react-spinners";

interface RegistrationInfosPropsType {
  registration: CadastroFundosType | false;
  isLoading: boolean;
}

type CadastroFundosKey =
  | "CNPJ_FUNDO"
  | "TP_FUNDO"
  | "DENOM_SOCIAL"
  | "DT_REG"
  | "DT_CONST"
  | "CD_CVM"
  | "DT_CANCEL"
  | "SIT"
  | "DT_INI_SIT"
  | "DT_INI_ATIV"
  | "DT_INI_EXERC"
  | "DT_FIM_EXERC"
  | "CLASSE"
  | "DT_INI_CLASSE"
  | "RENTAB_FUNDO"
  | "CONDOM"
  | "FUNDO_COTAS"
  | "FUNDO_EXCLUSIVO"
  | "TRIB_LPRAZO"
  | "PUBLICO_ALVO"
  | "ENTID_INVEST"
  | "TAXA_PERFM"
  | "INF_TAXA_PERFM"
  | "TAXA_ADM"
  | "INF_TAXA_ADM"
  | "VL_PATRIM_LIQ"
  | "DT_PATRIM_LIQ"
  | "DIRETOR"
  | "CNPJ_ADMIN"
  | "ADMIN"
  | "PF_PJ_GESTOR"
  | "CPF_CNPJ_GESTOR"
  | "GESTOR"
  | "CNPJ_AUDITOR"
  | "AUDITOR"
  | "CNPJ_CUSTODIANTE"
  | "CUSTODIANTE"
  | "CNPJ_CONTROLADOR"
  | "CONTROLADOR"
  | "INVEST_CEMPR_EXTER"
  | "CLASSE_ANBIMA";

export default function RegistrationInfos({
  registration,
  isLoading,
}: RegistrationInfosPropsType) {
  const fieldsToShow: CadastroFundosKey[] = [
    // "CNPJ_FUNDO",
    "DENOM_SOCIAL",
    // "TP_FUNDO",
    // "CLASSE",
    "CLASSE_ANBIMA",
    // "SIT",
    // "DT_CONST",
    // "DT_REG",
    // "RENTAB_FUNDO",
    // "CONDOM",
    // "CD_CVM",
    // "FUNDO_COTAS",
    // "PUBLICO_ALVO",
  ];

  const titlesOfFields = [
    // "CNPJ",
    "Fund Name",
    // "Type",
    // "Class",
    "ANBIMA Class",
    // "Situation",
    // "Constitution date",
    // "Registration date",
    // "Fund Rentability",
    // "Open/Closed",
    // "CVM registration",
    // "Fund of Funds",
    // "Target Public",
  ];

  return (
    <div
      id="registrationInfos"
      className="mt-4 text-white flex flex-col items-center w-full lg:items-start"
    >
      <h1 className="my-4 text-lg mx-[32vw] text-white/90 border-white/90 font-semibold text-center border-b lg:pb-2 lg:indent-4 lg:mx-2 lg:text-left lg:w-[98%]">
        Fund Infos.
      </h1>
      {!isLoading && registration ? (
        <ul className="italic text-white/80 flex flex-col gap-1 pl-6 pr-4 lg:ml-12 lg:px-2">
          {fieldsToShow.map((cE, cI) => {
            return (
              <li>
                <span className="font-semibold text-white -ml-1">
                  {titlesOfFields[cI]}
                </span>
                : {registration[cE]}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex w-full justify-center">
          <ClipLoader
            color={"white"}
            loading={isLoading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="my-4"
            speedMultiplier={0.75}
          />
        </div>
      )}
    </div>
  );
}
