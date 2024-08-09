import { capitalize, getToneColor } from "@/functions/functions";
import { toneColorsMapTxtRG } from "@/utils/toneColors";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

export interface CorrelAssocArrType {
  [key: string]: number;
}

export interface HeatMapObjType {
  avg: any;
  fund: any;
}

export interface HeatMapPropsType {
  title: string;
  heatMapArr: HeatMapObjType | false;
}

export default function HeatMap({ title, heatMapArr }: HeatMapPropsType) {
  const titleClass: string = "text-center mb-4",
    tableClass: string = "text-center border border-gray-500 rounded-lg w-full";

  const [isLoadingCorrels, setIsLoadingCorrels] = useState(true);
  const [selCorrels, setSelCorrels] = useState<any>([]);
  const [tickers, setTickers] = useState<string[]>([]);
  const [numMonths, setNumMonths] = useState(6);

  useEffect(() => {
    if (heatMapArr) {
      const keys = ["avg", "fund"];
      let newSelCorrel: HeatMapObjType = {
        avg: {},
        fund: {},
      };

      for (const key of keys) {
        const correlArrays = heatMapArr[key as keyof HeatMapObjType];
        const newSelCorrelEl = correlArrays.filter((cE: any) => {
          return cE["janela_em_meses"] === numMonths;
        });

        if (newSelCorrelEl.length === 1) {
          newSelCorrel[key as keyof HeatMapObjType] = newSelCorrelEl[0];
        }
      }

      if (newSelCorrel.fund && newSelCorrel.avg) {
        const newTickers: string[] = Object.keys(newSelCorrel.fund);

        const exclude = ["janela_em_meses", "CLASSE_ANBIMA"];

        const filteredTickers = newTickers.filter(
          (cE) => !exclude.includes(cE)
        );

        console.log("newSelCorrel");
        console.log(newSelCorrel);
        console.log("filteredTickers");
        console.log(filteredTickers);
        setTickers(filteredTickers);
        setSelCorrels(newSelCorrel);
        setIsLoadingCorrels(false);
      }
    } else {
      setIsLoadingCorrels(true);
    }
  }, [heatMapArr, numMonths]);

  function handleNumMonthsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNumMonths(Number(e.target.value));
  }

  return (
    <div className="w-full">
      <h2
        className={`mt-4 text-lg mx-[16vw] text-white/90 p-2 border-white/90 font-semibold text-center border-b lg:m-4 lg:pb-2 lg:text-left`}
      >
        {title}
      </h2>
      <div className="text-sm text-gray-200 py-6 flex relative justify-center lg:mb-6 lg:pt-4 lg:text-base">
        <form className="flex gap-2 left-24 md:gap-8 lg:absolute">
          <h4 className="mr-2 md:mr-6">Correlation period: </h4>
          <div className="flex text-xs items-center gap-1 md:text-sm">
            <input
              type="radio"
              name="monthsCorrel"
              id="monthsCorrel6"
              value={6}
              onChange={handleNumMonthsChange}
              checked={numMonths === 6}
            />
            <label htmlFor="monthsCorrel6">6 months</label>
          </div>
          <div className="flex items-center gap-1 text-xs md:text-sm">
            <input
              type="radio"
              name="monthsCorrel"
              id="monthsCorrel12"
              value={12}
              onChange={handleNumMonthsChange}
              checked={numMonths === 12}
            />
            <label htmlFor="monthsCorrel12">12 months</label>
          </div>
        </form>
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
            <table className={`${tableClass}`}>
              <thead className="">
                <tr className="bg-gray-400 bg-opacity-60 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-center"></th>
                  {tickers.map((ticker) => (
                    <th key={ticker} className="py-3 px-6 text-center w-1/12">
                      {ticker}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-white text-sm font-light">
                {Object.keys(selCorrels).map((key) => {
                  return (
                    <tr className="border-t border-gray-600 hover:bg-gray-700 hover:bg-opacity-50">
                      <td className="py-3 px-6 text-lg bg-gray-300 text-black text-center font-bold whitespace-nowrap">
                        {capitalize(key)}
                      </td>
                      {tickers.map((ticker) => {
                        const id = Math.random();
                        const value = selCorrels[key][ticker];
                        const color = getToneColor(
                          value,
                          toneColorsMapTxtRG,
                          0.9
                        );
                        const valColor =
                          value < 0 ? "rgb(100, 0, 0)" : "rgb(0, 50, 0)";
                        return (
                          <td
                            key={id}
                            className="py-3 px-6 text-center bg-opacity-20 text-black font-bold text-md"
                            style={{
                              backgroundColor: color,
                              color: valColor,
                            }}
                          >
                            {value.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* End Desk */}

          {/* Mobile */}
          <div className="overflow-x-auto lg:hidden">
            <table className={`${tableClass}`}>
              <thead>
                <tr className="bg-gray-700 bg-opacity-50 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left w-1/3"></th>
                  {Object.keys(selCorrels).map((key) => (
                    <th key={key} className="py-3 px-6 text-center">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-white text-sm font-light">
                {tickers.map((ticker) => {
                  const id = Math.random();
                  return (
                    <tr
                      key={id}
                      className="border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-50"
                    >
                      <td className="py-3 px-6 bg-gradient-to-r from-gray-100 to-gray-300 text-black text-center whitespace-nowrap font-medium w-1/3">
                        {ticker}
                      </td>
                      {Object.keys(selCorrels).map((key) => {
                        const value = selCorrels[key][ticker];
                        const color = getToneColor(
                          value,
                          toneColorsMapTxtRG,
                          0.9
                        );
                        const valColor =
                          value < 0 ? "rgb(100, 0, 0)" : "rgb(0, 50, 0)";
                        return (
                          <td
                            className="py-3 px-6 text-center bg-opacity-20 text-black font-bold text-md"
                            style={{
                              backgroundColor: color,
                              color: valColor,
                            }}
                          >
                            {value.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  );
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
