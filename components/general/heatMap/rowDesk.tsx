import { toneColorsMapTxtRGB } from "@/utils/toneColors";
import { getToneColor } from "@/utils/functions/genericFunctions";
import { capitalize } from "@/utils/functions/genericFunctions";
import type { RowDeskPropsType } from "./heatMapTypes";

export default function RowDesk({
  id,
  name,
  tickers,
  selCorrels,
}: RowDeskPropsType) {
  return (
    <tr
      key={id}
      className={`border-t border-gray-600 hover:bg-gray-800 hover:bg-opacity-50 last:rounded-b-sm`}
    >
      <td
        className={`py-3 px-6 text-base bg-gray-300 text-black text-center font-bold whitespace-nowrap w-1/12 border-r-2`}
        style={{width: '30px'}}
      >
        {capitalize(name)}
      </td>
      {tickers.map((ticker) => {
        const id = Math.random();
        const value = selCorrels[name][ticker];
        const color = getToneColor(value, toneColorsMapTxtRGB, 0.9);
        const valColor = value < 0 ? "rgb(100, 0, 0)" : "rgb(0, 50, 0)";
        return (
          <td
            key={id}
            className="py-3 px-6 text-center bg-opacity-20 text-black font-bold text-md"
            style={{
              backgroundColor: color ? color : "white",
              color: valColor,
            }}
          >
            <span>
              { value.toFixed(2) }
            </span>
          </td>
        );
      })}
    </tr>
  );
}
