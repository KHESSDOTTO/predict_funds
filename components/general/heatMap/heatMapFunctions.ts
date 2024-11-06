import { HeatMapObjType } from "./heatMapTypes";
import type { PrepareHeatMapParamsType } from "./heatMapTypes";

function prepareHeatMap({
  heatMapObj,
  exclude,
  numMonths,
  setTickers,
  setSelCorrels,
}: PrepareHeatMapParamsType): void {
  const keys = Object.keys(heatMapObj) as (keyof HeatMapObjType)[];
  let newSelCorrel: HeatMapObjType = {
    avg: {},
    fund: {},
  };

  for (const key of keys) {
    const correlArrays = heatMapObj[key as keyof HeatMapObjType];
    const newSelCorrelEl = correlArrays.filter((cE: any) => {
      return cE["janela_em_meses"] === numMonths;
    });

    if (newSelCorrelEl.length === 1) {
      newSelCorrel[key as keyof HeatMapObjType] = newSelCorrelEl[0];
    }
  }

  if (newSelCorrel.fund && newSelCorrel.avg) {
    const newTickers: string[] = Object.keys(newSelCorrel.fund);
    const filteredTickers = newTickers.filter((cE) => !exclude.includes(cE));

    setTickers(filteredTickers);
    setSelCorrels(newSelCorrel);
  }
}

export { prepareHeatMap };
