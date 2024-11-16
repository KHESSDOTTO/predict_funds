import { useState } from "react";
import { SelFundInfosPropsType, SliderInitialInfosItemType } from "./netFundingHistogramChartTypes";
import { RawHistogramData } from "@/database/models/prediction/predictionsType";

export default function SelFundInfos({
  currCnpj,
  dataForHistogram,
  sliderInitialInfos
}: SelFundInfosPropsType) {
  const selectedFund = dataForHistogram.find(fund => fund['CNPJ_FUNDO'] === currCnpj);

  if (! selectedFund) {
    return <></>
  }

  const infosArr = Object.entries(sliderInitialInfos) as [keyof RawHistogramData, SliderInitialInfosItemType][];

  return (
    <div>
      <h3>
        Selected fund infos:
      </h3>
      <ul>
        {
          infosArr.map(([currField, currInfos]) => {
            return(
              <li>
                {currInfos['title']}:&nbsp;{selectedFund[currField]}
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}