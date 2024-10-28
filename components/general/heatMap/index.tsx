import { mapTickers } from "@/utils/mapTickersCorrels";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import type {
  HeatMapObjType,
  HeatMapPropsType,
  PrepareHeatMapArgsType,
} from "./heatMapTypes";
import { prepareHeatMap } from "./heatMapFunctions";
import HeatMapForm from "./forms/heatMapForm";
import RowDesk from "./rowDesk";
import RowMobile from "./rowMobile";

export default function HeatMap({ title, heatMapObj }: HeatMapPropsType) {
  const [isLoadingCorrels, setIsLoadingCorrels] = useState(true);
  const [tickers, setTickers] = useState<string[]>([]);
  const [numMonths, setNumMonths] = useState(6);
  const exclude = ["janela_em_meses", "CLASSE_ANBIMA", "updated_at"];
  const [selCorrels, setSelCorrels] = useState<HeatMapObjType>({
    avg: {},
    fund: {},
  });
  const selCorrelsKeys = Object.keys(selCorrels) as (keyof HeatMapObjType)[];
  const heatMapFormArgs = {
    numMonths,
    setNumMonths,
  };

  useEffect(() => {
    if (heatMapObj) {
      const prepareHeatMapArgs: PrepareHeatMapArgsType = {
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
      <h2
        className={`text-lg mx-[16vw] text-white/90 p-2 border-white/90 font-semibold text-center border-b lg:m-4 lg:pb-2 lg:text-left`}
      >
        {title}
      </h2>
      <div className="text-sm text-gray-200 py-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
        <HeatMapForm {...heatMapFormArgs} />
      </div>

      {isLoadingCorrels && (
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
      )}

      {!isLoadingCorrels && (
        <>
          {/* Desk */}
          <div className="overflow-x-auto hidden lg:block lg:w-11/12 mx-auto">
            <table className="text-center border border-gray-500 rounded-md border-separate border-spacing-0 overflow-hidden">
              <thead>
                <tr className="bg-gray-500 bg-opacity-60 text-white uppercase text-sm leading-normal">
                  <th className="text-center"></th>
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
                {selCorrelsKeys.map((key) => {
                  const id = Math.random();
                  return <RowDesk {...{ id, key, tickers, selCorrels }} />;
                })}
              </tbody>
            </table>
          </div>
          {/* End Desk */}

          {/* Mobile */}
          <div className="overflow-x-auto lg:hidden">
            <table className="text-center border border-gray-500 rounded-lg w-full">
              <thead>
                <tr className="bg-gray-700 bg-opacity-50 text-white uppercase text-sm leading-normal">
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
    </div>
  );
}
