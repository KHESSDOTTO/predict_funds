import { ClipLoader } from "react-spinners";
import type { RegistrationInfosPropsType } from "./registrationInfosTypes";
import TitleComponent from "@/components/UI/titleComponent";

export default function RegistrationInfos({
  registration,
  isLoading,
}: RegistrationInfosPropsType) {
  const fieldsToShow = [
    "CNPJ_Fundo",
    "Denominacao_Social_F",
    "Classificacao",
  ] as const;
  const titlesOfFields = ["CNPJ", "Fund Name", "CVM Class"];

  return (
    <div
      id="registrationInfos"
      className="text-white flex flex-col items-center w-full lg:items-start"
    >
      <div className="flex justify-center lg:block w-full">
        <TitleComponent>Fund Infos.</TitleComponent>
      </div>
      {isLoading && (
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
      {!isLoading && !registration && (
        <p className="italic text-center mt-1 px-2 text-gray-400 lg:text-start">
          No data was found
        </p>
      )}
      {!isLoading && registration && (
        <ul className="italic text-white/80 flex flex-col gap-1 lg:px-0">
          {fieldsToShow.map((cE, cI) => {
            return (
              <li key={titlesOfFields[cI]}>
                <span className="font-semibold text-white">
                  {titlesOfFields[cI]} :
                  &nbsp;
                </span>
                <span>{registration[cE]}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
