import { ClipLoader } from "react-spinners";
import type { RegistrationInfosPropsType } from "./registrationInfosTypes";
import TitleComponent from "@/components/UI/titleComponent";

export default function RegistrationInfos({
  registration,
  isLoading,
}: RegistrationInfosPropsType) {
  const fieldsToShow = [
    "CNPJ_FUNDO",
    "DENOM_SOCIAL",
    "CLASSE",
    "CLASSE_ANBIMA"
  ] as const;
  const titlesOfFields = [
    "CNPJ",
    "Fund Name",
    "CVM Class",
    "ANBIMA Class"
  ];

  return (
    <div
      id="registrationInfos"
      className="text-white flex flex-col items-center w-full lg:items-start"
    >
      <div className="flex justify-center lg:block w-full">
        <TitleComponent>Fund Infos.</TitleComponent>
      </div>
      {!isLoading && registration ? (
        <ul className="italic text-white/80 flex flex-col gap-1 pl-6 pr-4 lg:ml-8 lg:px-0">
          {fieldsToShow.map((cE, cI) => {
            return (
              <li key={titlesOfFields[cI]}>
                <span className="font-semibold text-white -ml-1 mr-2">
                  {titlesOfFields[cI]} :
                </span>
                <span>{registration[cE]}</span>
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
