import { mapTickers } from "@/utils/mapTickersCorrels";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import type {
  HeatMapObjType,
  HeatMapPropsType,
  PrepareHeatMapParamsType,
} from "./heatMapTypes";
import { exportHeatMap, prepareHeatMap } from "./heatMapFunctions";
import HeatMapForm from "./forms/heatMapForm";
import RowDesk from "./rowDesk";
import RowMobile from "./rowMobile";
import TitleComponent from "@/components/UI/titleComponent";
import { consoleLog } from "@/utils/functions/genericFunctions";
import ButtonGreen from "@/components/UI/buttonGreen";
import { useControlForm } from "@/contexts/controlFormContext";
import { track } from "@vercel/analytics";
import { useUser } from "@/contexts/userContext";

export default function HeatMap({ title, heatMapObj }: HeatMapPropsType) {
  const { user } = useUser();
  const [isLoadingCorrels, setIsLoadingCorrels] = useState(true);
  const [tickers, setTickers] = useState<string[]>([]);
  const [numMonths, setNumMonths] = useState(6);
  const exclude = ["janela_em_meses", "classificacao", "updated_at"];
  const [selCorrels, setSelCorrels] = useState<HeatMapObjType>({
    avg: {},
    fund: {},
  });
  const { controlForm } = useControlForm();
  const selCorrelsKeys = Object.keys(selCorrels) as (keyof HeatMapObjType)[];
  const heatMapFormArgs = {
    numMonths,
    setNumMonths,
  };

  useEffect(() => {
    if (heatMapObj) {
      const prepareHeatMapArgs: PrepareHeatMapParamsType = {
        heatMapObj,
        exclude,
        numMonths,
        setTickers,
        setSelCorrels,
      };

      prepareHeatMap(prepareHeatMapArgs);
      setIsLoadingCorrels(false);
    } else {
      setIsLoadingCorrels(true);
    }
  }, [heatMapObj, numMonths]);

  return (
    <div className="w-full">
      <div className="flex justify-center lg:block lg:w-full">
        <TitleComponent>{title}</TitleComponent>
      </div>
      <div className="text-sm text-gray-200 pb-4 pt-2 flex relative justify-center lg:py-6 lg:mb-6 lg:pt-4 lg:text-base">
        <HeatMapForm {...heatMapFormArgs} />
        <div
          className="absolute bottom-[50%] translate-y-[50%] right-10 scale-90 hidden lg:block"
          onClick={() =>
            heatMapObj && controlForm
              ? exportHeatMap({ selCnpj: controlForm.buscaCnpj, heatMapObj })
              : {}
          }
        >
          <ButtonGreen shadowColor="white/30" shadowSize="md">
            Export
          </ButtonGreen>
        </div>
      </div>

      {isLoadingCorrels ? (
        <div className="flex justify-center items-center">
          <ClipLoader
            color={"white"}
            loading={isLoadingCorrels}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
            className="my-4"
            speedMultiplier={0.75}
          />
        </div>
      ) : (
        <>
          {/* Desk */}
          <div
            className="overflow-x-auto hidden lg:block lg:w-11/12 mx-auto rounded-md hover:scale-[101%] duration-200 transition-all"
            style={{ boxShadow: "0 3px 10px 0 rgba(255,255,255,0.8)" }}
          >
            <table className="text-center border border-gray-500 rounded-md border-separate border-spacing-0 overflow-hidden">
              <thead>
                <tr className="bg-gray-500 bg-opacity-60 text-white uppercase text-sm leading-normal">
                  <th className="text-center w-1/12"></th>

                  {tickers.map((ticker) => {
                    const nameTicker = mapTickers[ticker]
                      ? mapTickers[ticker]
                      : ticker;

                    return (
                      <th
                        key={ticker}
                        className="py-2 px-1 text-center w-1/12 text-sm"
                      >
                        {nameTicker}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="text-white text-sm font-light">
                {selCorrelsKeys.map((name) => {
                  const id = Math.random();

                  return <RowDesk {...{ id, name, tickers, selCorrels }} />;
                })}
              </tbody>
            </table>
          </div>
          {/* End Desk */}

          {/* Mobile */}
          <div
            className="overflow-x-auto lg:hidden hover:scale-[101%] rounded-lg duration-200 transition-all"
            style={{ boxShadow: "0 1px 10px 0 rgba(255,255,255,0.8)" }}
          >
            <table className="text-center w-full">
              <thead>
                <tr className="bg-gray-800 bg-opacity-50 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left w-1/3"></th>

                  {selCorrelsKeys.map((key) => (
                    <th key={key} className="py-3 px-6 text-center">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-white text-sm font-light">
                {tickers.map((ticker) => {
                  const id = Math.random();

                  return <RowMobile {...{ id, ticker, selCorrels }} />;
                })}
              </tbody>
            </table>
          </div>
          {/* End Mobile */}
        </>
      )}

      <div className="flex justify-center relative mt-4 lg:hidden">
        <div
          className="w-fit h-fit"
          onClick={() => {
            track("export_heat_map", { username: user?.username || null });
            if (heatMapObj && controlForm) {
              exportHeatMap({ selCnpj: controlForm.buscaCnpj, heatMapObj });
            }
          }}
        >
          <ButtonGreen shadowColor="white/30" shadowSize="md">
            Export
          </ButtonGreen>
        </div>
      </div>
    </div>
  );
}
