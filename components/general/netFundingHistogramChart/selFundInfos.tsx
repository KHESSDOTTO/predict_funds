import { useState } from "react";
import {
  SelFundInfosPropsType,
  SliderInitialInfosItemType,
} from "./netFundingHistogramChartTypes";
import { RawHistogramData } from "@/database/models/prediction/predictionsType";

export default function SelFundInfos({
  currCnpj,
  dataForHistogram,
  sliderInitialInfos,
}: SelFundInfosPropsType) {
  const selectedFund = dataForHistogram.find(
    (fund) => fund["CNPJ_FUNDO"] === currCnpj
  );

  if (!selectedFund) {
    return <></>;
  }

  const infosArr = Object.entries(sliderInitialInfos) as [
    keyof RawHistogramData,
    SliderInitialInfosItemType
  ][];

  return (
    <div className="text-center lg:text-left">
      <h3 className="mb-4 font-semibold text-lg lg:text-lg">
        Selected fund infos:
      </h3>
      <ul className="flex flex-col gap-4 text-base lg:px-2 lg:text-sm">
        <li className="flex border-b-2 px-1 border-gray-400 lg:border-none items-center lg:w-full">
          <span className="w-[200px] lg:w-[240px] text-left">CVM Class:</span>
          &nbsp;
          <span
            className="
                grow text-gray-200 italic
                lg:py-1 lg:px-4 lg:bg-gray-300 lg:rounded-full lg:text-gray-800 lg:not-italic
            "
          >
            {selectedFund["classificacao"]}
          </span>
        </li>

        {infosArr.map(([currField, currInfos]) => {
          return (
            <li className="flex border-b-2 py-1 px-1 border-gray-400 lg:border-none items-center lg:w-full">
              <span className="text-left w-[200px] lg:w-[240px]">
                {currInfos["title"]}:
              </span>
              &nbsp;
              <span
                className="
                    grow text-gray-200 italic 
                    lg:py-1 lg:px-4 lg:bg-gray-300 lg:rounded-full lg:text-gray-800 lg:not-italic
                  "
              >
                {currInfos["formatterFunction"](
                  Number(selectedFund[currField])
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
