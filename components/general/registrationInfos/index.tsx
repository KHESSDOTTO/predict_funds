import { ClipLoader } from "react-spinners";
import type { RegistrationInfosPropsType } from "./registrationInfosTypes";

export default function RegistrationInfos({
  registration,
  isLoading,
}: RegistrationInfosPropsType) {
  const fieldsToShow = ["CNPJ_FUNDO", "DENOM_SOCIAL", "CLASSE_ANBIMA"] as const;
  const titlesOfFields = ["CNPJ", "Fund Name", "ANBIMA Class"];

  return (
    <div
      id="registrationInfos"
      className="text-white flex flex-col items-center w-full lg:items-start"
    >
      <h2 className="text-lg mx-[16vw] text-white/90 mb-4 p-2 border-white/90 font-semibold text-center border-b lg:m-4 lg:pb-2 lg:text-left lg:w-[97.5vw]">
        Fund Infos.
      </h2>
      {!isLoading && registration ? (
        <ul className="italic text-white/80 flex flex-col gap-1 pl-6 pr-4 lg:ml-12 lg:px-2">
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
