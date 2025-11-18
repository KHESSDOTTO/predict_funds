import { toneColorsMapTxtRGB } from "@/utils/toneColors";
import Helpers from "@/utils/functions/helpers/helpers";
import { HeatMapObjType } from "./heatMapTypes";
import { mapTickers } from "@/utils/mapTickersCorrels";
import type { RowMobilePropsType } from "./heatMapTypes";
import crypto from "crypto";

export default function RowMobile({
  id,
  selCorrels,
  ticker,
}: RowMobilePropsType) {
  const nameTicker = mapTickers[ticker] ? mapTickers[ticker] : ticker;
  const selCorrelsKeys = Object.keys(selCorrels) as (keyof HeatMapObjType)[];

  return (
    <tr
      key={id}
      className="border-b border-gray-600 hover:bg-gray-800 hover:bg-opacity-50"
    >
      <td className="py-3 px-6 bg-gradient-to-r from-gray-100 to-gray-300 text-black text-center whitespace-nowrap font-medium w-1/3">
        {nameTicker}
      </td>
      {selCorrelsKeys.map((key) => {
        const id = crypto.createHash("md5").update(key).digest("hex");
        const value = selCorrels[key][ticker];
        const color = Helpers.getToneColor(value, toneColorsMapTxtRGB, 0.9);
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
            {value.toFixed(2)}
          </td>
        );
      })}
    </tr>
  );
}
