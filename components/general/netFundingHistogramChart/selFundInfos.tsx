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
    <div className="text-center lg:text-left">
      <h3 className="mb-2 text-base lg:text-lg">
        Selected fund infos:
      </h3>
      <ul className="flex flex-col gap-1 text-base lg:px-2 lg:text-sm">
        <li>
          <span>
            CVM Class
          </span>
          :
          &nbsp;
          <span className="text-gray-200 italic ml-1">
            { selectedFund['CLASSE'] }
          </span>
        </li>

        {
          infosArr.map(([currField, currInfos]) => {
            return(
              <li>
                <span>
                  { currInfos['title'] }
                </span>
                :
                &nbsp;
                <span className="text-gray-200 italic ml-1">
                  { currInfos['formatterFunction'](Number(selectedFund[currField])) }
                </span>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}