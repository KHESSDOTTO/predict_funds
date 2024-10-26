import { CenarioType } from "@/utils/types";
import { useState } from "react";
import ChartSection from "../chartSection";
import ButtonRed from "../../UI/buttonRed";
import useWindowWidth from "@/hooks/useWindowWidth";

export interface CenarioCardPropsType {
  cenarioData: CenarioType;
  index: number;
  excludeCenarioFunction(cenarioId: string): void;
}

export default function CenarioCard({
  cenarioData,
  index,
  excludeCenarioFunction,
}: CenarioCardPropsType) {
  const { id, params, historicData, predictionData } = cenarioData;
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 992;

  const handleFadeOut = (e: React.MouseEvent<HTMLDivElement>): void => {
    setIsFadingOut(true);
    setTimeout(() => {
      excludeCenarioFunction(id);
    }, 200);
  };

  return (
    <div
      className={`border-black rounded-lg bg-white pt-2 mx-4 pb-4 px-4 flex flex-col items-center lg:mx-8 lg:flex-row lg:flex-wrap lg:items-start lg:w-full lg:mb-12 lg:rounded-md ${
        isFadingOut
          ? "opacity-0 transition-opacity duration-500"
          : "opacity-100"
      }`}
    >
      <h2 className="text-lg font-bold my-2 indent-1 w-2/3 pl-1 border-b-2 border-black lg:indent-4 lg:w-11/12">
        Cenario {index + 1}
      </h2>
      <div className="flex flex-col items-center w-full justify-between text-sm lg:flex-row">
        <div className="lg:flex lg:flex-wrap border-gray-400/80 lg:border-r lg:py-6 lg:pr-4">
          <h3 className="font-bold mx-4 hidden lg:block lg:mx-0 lg:mb-2">
            Params:
          </h3>
          <ul className="lg:flex gap-4 lg:flex-col lg:gap-1 lg:ml-2">
            <li>
              Var. Quota:
              <span className="font-bold">
                {" "}
                {(params.varCota * 100).toFixed(1)}%
              </span>
            </li>
            <li>
              Var. Sharehold.:
              <span className="font-bold">
                {" "}
                {(params.varCotistas * 100).toFixed(1)}%
              </span>
            </li>
            <li>
              Var. Net Fund.:
              <span className="font-bold">
                {" "}
                {(params.varNF * 100).toFixed(1)}%
              </span>
            </li>
            <li>
              CNPJ:
              <span className="font-bold"> {params.buscaCnpj}</span>
            </li>
            <li>
              Weeks back:
              <span className="font-bold"> {params.weeksBack}</span>
            </li>
            <li>
              Weeks forward:
              <span className="font-bold"> {params.weeksAhead}</span>{" "}
            </li>
          </ul>
        </div>
        <div className=" lg:block lg:w-full">
          <ChartSection
            historic={historicData}
            smallV={true}
            predictions={predictionData}
          />
        </div>
        {isMobile && (
          <div id={id} className="mt-6 lg:hidden" onClick={handleFadeOut}>
            <ButtonRed shadowColor="black" shadowSize="md">
              Delete
            </ButtonRed>
          </div>
        )}
      </div>
      {!isMobile && (
        <div
          id={id}
          className="hidden my-2 lg:flex lg:justify-start lg:mx-12 lg:w-full"
          onClick={handleFadeOut}
        >
          <ButtonRed shadowColor="black" shadowSize="md">
            Delete
          </ButtonRed>
        </div>
      )}
    </div>
  );
}
