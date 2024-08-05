import { capitalize, getToneColor, pushIfNew } from "@/functions/functions";
import { toneColorsMapTxtRG } from "@/utils/toneColors";

export interface CorrelAssocArrType {
  [key: string]: number;
}

export interface HeatMapPropsType {
  title: string;
  correlAssocArr: CorrelAssocArrType;
}

export default function HeatMap({ title, correlAssocArr }: HeatMapPropsType) {
  console.log("correlAssocArr");
  console.log(correlAssocArr);

  const titleClass: string = "text-center mb-4",
    tableClass: string = "text-center border border-gray-500 rounded-lg w-full";

  const colsDesk: string[] = [];
  const rowsDesk: string[] = [];
  for (const key in correlAssocArr) {
    const colArr = key.split("_"),
      col1 = colArr[0],
      col2 = colArr[1];
    pushIfNew(col1, colsDesk);
    pushIfNew(col2, rowsDesk);
  }
  const colsMobile: string[] = rowsDesk;
  const rowsMobile: string[] = colsDesk;

  return (
    <div className="mt-12 mb-6 w-screen">
      <h2 className={`${titleClass} text-xl font-semibold`}>{title}</h2>

      {/* Desk */}
      <div className="overflow-x-auto hidden lg:block lg:w-11/12 mx-auto">
        <table className={`${tableClass}`}>
          <thead className="">
            <tr className="bg-gray-400 bg-opacity-60 text-white uppercase text-sm leading-normal">
              <th></th>
              {colsDesk.map((currCol) => (
                <th key={currCol} className="py-3 px-6 text-center">
                  {currCol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white text-sm font-light">
            {rowsDesk.map((currRow) => (
              <tr
                key={currRow}
                className="border-t border-gray-600 hover:bg-gray-700 hover:bg-opacity-50"
              >
                <td className="py-3 px-6 text-lg bg-gray-200 text-black text-center font-bold whitespace-nowrap">
                  {capitalize(currRow)}
                </td>
                {colsDesk.map((currCol) => {
                  const key = currCol + "_" + currRow;
                  const value = correlAssocArr[key];
                  const color = getToneColor(value, toneColorsMapTxtRG, 0.9);
                  const valColor =
                    value < 0 ? "rgb(100, 0, 0)" : "rgb(0, 50, 0)";
                  return (
                    <td
                      key={key}
                      className="py-3 px-6 text-center bg-opacity-20 text-black font-bold text-md"
                      style={{ backgroundColor: color, color: valColor }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* End Desk */}

      {/* Mobile */}
      <div className="overflow-x-auto lg:hidden">
        <table className={`${tableClass}`}>
          <thead>
            <tr className="bg-gray-700 bg-opacity-50 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left"></th>
              {colsMobile.map((currCol) => (
                <th key={currCol} className="py-3 px-6 text-center">
                  {currCol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white text-sm font-light">
            {rowsMobile.map((currRow) => (
              <tr
                key={currRow}
                className="border-b border-gray-600 hover:bg-gray-700 hover:bg-opacity-50"
              >
                <td className="py-3 px-6 bg-gradient-to-r from-gray-100 to-gray-300 text-black text-center whitespace-nowrap font-medium">
                  {currRow}
                </td>
                {colsMobile.map((currCol) => {
                  const key = currRow + "_" + currCol;
                  const value = correlAssocArr[key];
                  const color = getToneColor(value, toneColorsMapTxtRG, 0.9);
                  const valColor =
                    value < 0 ? "rgb(100, 0, 0)" : "rgb(0, 50, 0)";
                  return (
                    <td
                      key={key}
                      className="py-3 px-6 text-center"
                      style={{ backgroundColor: color, color: valColor }}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* End Mobile */}
    </div>
  );
}
